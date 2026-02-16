import { useEffect, useState } from "react";
import { getUserExchanges } from "../api/userApi";
import { useLoading } from "../context/LoadingContext";

export default function CanjesPage() {
  const [canjes, setCanjes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchCanjes = async () => {
      try {
        showLoading();
        const res = await getUserExchanges();

        // Normaliza: si ya es array úsalo, si viene envuelto úsalo también
        const list =
          Array.isArray(res) ? res :
            Array.isArray(res?.Response?.oResponse) ? res.Response.oResponse :
              [];

        setCanjes(list);
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchCanjes();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-3">
        <div className="rounded-t-2xl bg-main text-white py-6 px-8 text-center">
          <h2 className="text-2xl font-bold">ESTADO DE MI CANJE</h2>
        </div>

        <div className="bg-white border border-t-0 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-black text-white text-left">
                <th className="py-3 px-6">Producto</th>
                <th className="py-3 px-6">Código</th>
                <th className="py-3 px-6">Cantidad</th>
                <th className="py-3 px-6">Estado</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 px-6 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : canjes.length > 0 ? (
                canjes.map((r) => (
                  <tr key={r?.Exchange?.Id ?? r?.Exchange?.Code} className="border-b">
                    <td className="py-4 px-6 text-sm">{r?.Exchange?.Product ?? "-"}</td>
                    <td className="py-4 px-6 text-sm">{r?.Exchange?.Code ?? "-"}</td>
                    <td className="py-4 px-6 text-sm">{r?.Exchange?.Quantity ?? "-"}</td>
                    <td className="py-4 px-6 text-sm">{r?.Estado ?? "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 px-6 text-xl font-bold text-center text-black">
                    No hay canjes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
