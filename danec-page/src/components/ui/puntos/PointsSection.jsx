import { useAuth } from "../../../context/AuthContext";

const PointsSection = ({ compras = [], selectedMonth = "" }) => {

  const { profile } = useAuth();
  console.log(profile);

  const totalAmount = compras.reduce((sum, c) => sum + (c.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Título Puntos */}
      <div className="bg-main text-white inline-block px-10 py-6 rounded-2xl text-4xl font-bold">
        Puntos
      </div>

      {/* Compras header */}
      <div className="flex items-center justify-between bg-main rounded-full">
        <div className="text-white px-8 py-2  font-bold">
          COMPRAS
        </div>
        <span className="text-white font-semibold capitalize mr-4 flex">
          {selectedMonth}
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3">Código cliente</th>
              <th>Participante</th>
              <th>Día de Cargue</th>
              <th>COMPRA</th>
              <th>Puntos ganados</th>
            </tr>
          </thead>

          <tbody>
            {compras.length === 0 ? (
              <tr><td colSpan={5} className="py-4 text-gray-500">No hay movimientos</td></tr>
            ) : (
              compras.map((c, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3">{profile.IdNumber || "-"}</td>
                  <td>{profile.ExtraInfo.name}</td>
                  <td>{new Date(c.start).toLocaleDateString()}</td>
                  <td>-</td>
                  <td>{c.total}</td>
                </tr>
              ))
            )}
          </tbody>

          {/* Footer total */}
          <tfoot>
            <tr className="bg-black text-white font-bold">
              <td colSpan={3} className="py-3">
                Total
              </td>
              <td>-</td>
              <td>{totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <button className="bg-main text-white px-6 py-2 rounded-full text-sm">
          *Click para saber cómo ganas puntos
        </button>
      </div>
    </div>
  );
};

export default PointsSection;