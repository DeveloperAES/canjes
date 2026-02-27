import { useAuth } from "../../../context/AuthContext";

const MonthlySummary = ({ data = {} }) => {
  const months = Object.keys(data);
  const totalpoints = Object.values(data).reduce((acc, monthData) => {
    // Sum total of all purchases in the month
    const monthTotal = (monthData.compras || []).reduce((sum, c) => sum + (c.total || 0), 0);
    return acc + monthTotal;
  }, 0);

  // Derive participant name from first available purchase (fallback logic)
  let participantName = "-";
  for (const m of months) {
    if (data[m]?.compras?.length > 0) {
      participantName = data[m].compras[0].name || "-"; // Assuming 'name' is participant/type? User's code used 'participante'
      // The API response shows "name": "compras". User screenshot shows name "JINSOP KELVIN".
      // We might need to get the real name from somewhere else if "compras" is just the type.
      // For now, let's use a placeholder or pass user name as prop.
      break;
    }
  }
  const { profile } = useAuth();

  return (
    <div>
      <h2 className="text-center font-bold mb-4">
        RESUMEN MES A MES
      </h2>

      {/* Header negro */}
      <div className="bg-black rounded-t-full text-white grid grid-cols-5 text-center py-3">
        <span></span>
        {months.map(m => <span key={m} className="capitalize">{m}</span>)}
        {/* Fill remaining columns if less than 4 months (leaving 1 for total) */}
        {Array.from({ length: Math.max(0, 4 - months.length) }).map((_, i) => <span key={`empty-${i}`}></span>)}
      </div>

      {/* Header rojo */}
      <div className="bg-main text-white grid grid-cols-5 text-center py-2 font-semibold">
        <span>Participante</span>
        {months.map(m => <span key={m}>Puntos</span>)}
        {Array.from({ length: Math.max(0, 4 - months.length) }).map((_, i) => <span key={`empty-h-${i}`}>Puntos</span>)}
      </div>

      {/* Data */}
      <div className="grid grid-cols-5 text-center py-3 border-b">
        <span>  {profile.ExtraInfo.name}</span>
        {months.map(m => {
          const val = (data[m].compras || []).reduce((sum, c) => sum + (c.total || 0), 0);
          return <span key={m}>{val}</span>;
        })}
        {Array.from({ length: Math.max(0, 4 - months.length) }).map((_, i) => <span key={`empty-v-${i}`}>-</span>)}
      </div>
      <div className="text-right mt-2 font-bold px-4">
        Total Acumulado: {totalpoints.toLocaleString('es-PE')}
      </div>
    </div>
  );
};

export default MonthlySummary;
