
import { Star, Coins, Ticket, HandCoins } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function PointsCards({ loading = false, error = "", data }) {
  const { profile } = useAuth();

  const row =
    data?.oResponse?.[0] ??
    data?.Response?.oResponse?.[0] ??
    data?.Response?.[0] ??
    data?.Response ??
    data;

  function formatDateText(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date)) return "-";

    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const cards = [
    {
      key: "ultima",
      label: "Últimos puntos cargados",
      value: formatDateText(row?.lastMonth),
      icon: Star,
      unit: "",
    },
    {
      key: "acumulados",
      label: "Puntos acumulados",
      value: row?.won ?? 0,
      icon: Coins,
      unit: "pts",
    },
    {
      key: "canjeados",
      label: "Puntos canjeados",
      value: row?.spent ?? 0,
      icon: Ticket,
      unit: "pts",
    },
    {
      key: "disponibles",
      label: "Puntos disponibles",
      value: row?.total ?? 0,
      icon: HandCoins,
      unit: "pts",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
     return <div className="text-red-500 font-medium">{error}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header: Saludo y Puntos Totales */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-[#f70030]">
          ¡Hola, {(profile?.NameCanonical ?? profile?.Nombres ?? "-").split(" ")[2] || "-"}!
        </h1>
        <div className="text-xl font-bold">
          Tienes {row?.total ?? 0} puntos
        </div>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-red-50 text-[#f70030]">
                <Icon size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium pb-1">
                  {card.label}
                </span>
                <span className="text-xl font-bold text-black">
                  {card.value}{card.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
