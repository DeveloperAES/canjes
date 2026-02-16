import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfileApi } from "../api/userApi";
import avatarPlaceholder from "../assets/react.svg";
import { useBranding } from "../context/BrandingContext";
import { useModal } from "../context/ModalContext";
import { useLoading } from "../context/LoadingContext";

export default function MiCuentaPage() {
  const { user, needsProfileUpdate, userDetails, refreshSession } = useAuth();
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { showLoading, hideLoading } = useLoading();

  const { branding } = useBranding();

  const bgForm = branding.formBackground;

  // Ensure details is an array
  const details = Array.isArray(userDetails?.Response?.oResponse) ? userDetails.Response.oResponse : [];

  // Filter options
  const canales = details.filter(d => d.group_key === "CANAL");
  const allPerfiles = details.filter(d => d.group_key === "PERFIL");


  const location = useLocation();


  // Toast cuando fue redirigido por el guard
  useEffect(() => {
    // console.log("Location State in MiCuenta:", location.state);
    if (location.state?.from) {
      showModal({
        type: 'error',
        title: 'Faltan Datos',
        message: 'Te falta completar tus datos para continuar.'
      });
    }
  }, [location.state]);

  const profile = user?.Response?.oResponse ?? null;


  const extra = profile?.ExtraInfo;


  // console.log("User Details:", user?.Response?.oResponse);

  const [formData, setFormData] = useState({
    id_usuario: "",
    cedula: "",
    nombre: "",
    apellido: "",
    celular: "",
    ruc: "",
    razon_social: "",
    codigo_cliente: "",
    agencia: "",
    canal: "",
    perfil: "",
  });

  // Derive perfiles based on selected canal 
  const selectedCanalObj = canales.find(c => c.option_value === formData.canal);
  const availablePerfiles = selectedCanalObj
    ? allPerfiles.filter(p => p.parent_id === selectedCanalObj.id)
    : [];

  // console.log("User Details:", user?.Response?.oResponse.NameCanonical);
  useEffect(() => {
    if (profile) {
      setFormData({
        id_usuario: String(user?.Response?.oResponse?.Id) ?? "",
        cedula: extra?.cedula ?? "",
        nombre: extra?.name ?? profile?.name_canonical ?? "",
        apellido: extra?.lastName ?? "",
        celular: extra?.telephoneNumber ?? "",
        ruc: extra?.businessRuc ?? "",
        razon_social: user?.Response?.oResponse?.NameCanonical ?? "",
        codigo_cliente: user?.Response?.oResponse?.Username ?? user?.Response?.oResponse?.IdNumber ?? "",
        agencia: extra?.agencia ?? "",
        canal: extra?.category ?? "",
        perfil: extra?.profile ?? "",
      });
    }
  }, [profile, extra]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for numeric and length constraints
    if (name === "cedula" || name === "celular") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }
    if (name === "ruc") {
      if (!/^\d*$/.test(value) || value.length > 13) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const completion = useMemo(() => {
    const required = Object.values(formData);
    const filled = required.filter(
      (v) => v && v !== "-" && String(v).trim() !== ""
    ).length;
    return Math.round((filled / required.length) * 100);
  }, [formData]);


  const isUpdated = !needsProfileUpdate;
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleUpdate = async () => {
    if (!isUpdated && !termsAccepted) {
      showModal({
        type: 'error',
        title: 'TÉRMINOS Y CONDICIONES',
        message: 'Debes aceptar los términos y condiciones'
      });
      return;
    }

    // Exact length validations
    if (formData.cedula.length !== 10) {
      showModal({
        type: 'error',
        title: 'CAMPOS INCORRECTOS',
        message: 'La cédula debe tener 10 dígitos'
      });
      return;
    }
    if (formData.celular.length !== 10) {
      showModal({
        type: 'error',
        title: 'CAMPOS INCORRECTOS',
        message: 'El celular debe tener 10 dígitos'
      });
      return;
    }
    if (formData.ruc.length !== 13) {
      showModal({
        type: 'error',
        title: 'CAMPOS INCORRECTOS',
        message: 'El RUC debe tener 13 dígitos'
      });
      return;
    }

    if (formData.perfil == "") {
      showModal({
        type: 'error',
        title: 'CAMPOS INCORRECTOS',
        message: 'El perfil es obligatorio'
      });
      return;
    }


    showLoading();
    try {
      const payload = {
        ...formData,
        id_usuario: String(formData.id_usuario),
        updated: true
      };
      console.log("Enviando datos:", payload);
      const res = await updateProfileApi(payload);
      const newToken = res?.Response?.oResponse?.token;

      await refreshSession(newToken); // Refresh data with new token (if any)

      const successTitle = !isUpdated ? "REGISTRO EXITOSO" : "ACTUALIZACIÓN EXITOSA";
      const successMessage = !isUpdated
        ? "Tu registro se ha completado correctamente."
        : "Perfil actualizado correctamente";

      showModal({
        type: 'success',
        title: successTitle,
        message: successMessage,
        onConfirm: () => navigate("/")
      });

    } catch (error) {
      console.error(error);
      showModal({
        type: 'error',
        title: 'ERROR',
        message: 'Error al actualizar el perfil'
      });
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: bgForm ? `url(${bgForm})` : "none",
    }}>
      <div className="w-full max-w-[900px] bg-white p-8">

        <h1 className="text-[#f70030] text-3xl md:text-5xl font-bold text-center mb-10 md:mb-16">
          {isUpdated ? "Mi cuenta" : "Completa tus datos"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
          {/* Row 1 */}
          <InputField
            label="CÉDULA *"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
          />
          <InputField
            label="NOMBRES *"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />

          {/* Row 2 */}
          <InputField
            label="APELLIDOS *"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
          />
          <InputField
            label="CELULAR *"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
          />

          {/* Row 3 */}
          <InputField
            label="RUC*"
            name="ruc"
            value={formData.ruc}
            onChange={handleChange}
          />
          <ReadOnlyField
            label="RAZÓN SOCIAL"
            value={formData.razon_social}
          />

          {/* Row 4 */}
          <ReadOnlyField
            label="CÓDIGO DE CLIENTE"
            value={formData.codigo_cliente}
          />
          <ReadOnlyField
            label="AGENCIA"
            value={formData.agencia}
          />

          {/* Row 5 */}
          <ReadOnlyField
            label="CANAL"
            value={formData.canal}
          />

          <div className="flex flex-col gap-1 border-b-2 border-gray-50 py-1 transition-all focus-within:border-[#f70030]">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
              PERFIL *
            </label>
            <select
              name="perfil"
              value={formData.perfil}
              onChange={handleChange}
              disabled={!formData.canal || isUpdated}
              className="font-bold w-full outline-none text-black bg-white py-1 cursor-pointer appearance-none"
            >
              <option value="">Seleccione...</option>
              {availablePerfiles.map(opt => (
                <option key={opt.id} value={opt.option_value}>
                  {opt.option_text}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox */}
        <div className="mt-10 md:mt-12 flex items-center justify-start gap-3">
          {!isUpdated ? (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-800 font-medium text-sm md:text-base cursor-pointer">
                Acepto TÉRMINOS Y CONDICIONES y autorizo el USO DE DATOS
              </span>
            </label>
          ) : (
            <p className="text-sm text-gray-500">
              Ya aceptó <span className="underline">TÉRMINOS Y CONDICIONES y autorizo el USO DE DATOS</span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-10 md:mt-12 flex justify-center">
          <button
            onClick={handleUpdate}
            className="bg-[#f70030] text-white font-bold py-3.5 px-20 rounded-full text-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-wide"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1 border-b-2 border-gray-100 py-1 transition-all focus-within:border-[#f70030]">
      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="font-bold w-full outline-none text-black bg-transparent py-1"
        placeholder="..."
      />
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="flex flex-col gap-1 py-1">
      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="font-bold text-black py-1 uppercase truncate">
        {value || "-"}
      </div>
    </div>
  );
}
