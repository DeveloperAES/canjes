
import Filters from "../components/ui/puntos/Filter"
import MonthlySummary from "../components/ui/puntos/MonthlySummary"
import PointsSection from "../components/ui/puntos/PointsSection"
import { useState, useEffect } from "react";
import { getUserDetailedPointsApi } from "../api/userApi";
import { useLoading } from "../context/LoadingContext";

const PointsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  const [error, setError] = useState(null);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoading();
        setLoading(true);
        const response = await getUserDetailedPointsApi();
        if (response.Success && response.Response && response.Response.oResponse) {
          setData(response.Response.oResponse);

          // Initial Selection
          const years = Object.keys(response.Response.oResponse).sort((a, b) => b - a);
          if (years.length > 0) {
            const yr = years[0];
            setSelectedYear(yr);
            const months = Object.keys(response.Response.oResponse[yr]);
            if (months.length > 0) setSelectedMonth(months[0]);
          }

        } else {
          setError("Formato de respuesta inválido");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar los puntos detallados");
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchData();
  }, []);

  // Derived Data
  const years = data ? Object.keys(data).sort((a, b) => b - a) : [];
  const months = (data && selectedYear) ? Object.keys(data[selectedYear]) : [];

  // Data for Monthly Summary (Pass all months of selected year)
  const summaryData = (data && selectedYear) ? data[selectedYear] : {};

  // Data for Points Section (Pass transactions of selected month)
  const purchases = (data && selectedYear && selectedMonth && data[selectedYear][selectedMonth])
    ? data[selectedYear][selectedMonth].compras
    : [];

  if (loading) return <div className="p-8 text-center">Cargando puntos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-8 text-center">No hay datos disponibles</div>;

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <Filters
          years={years}
          months={months}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={(y) => {
            setSelectedYear(y);
            // Reset month selection on year change
            const ms = Object.keys(data[y]);
            if (ms.length > 0) setSelectedMonth(ms[0]);
            else setSelectedMonth("");
          }}
          onMonthChange={setSelectedMonth}
        />

        <MonthlySummary data={summaryData} />

        <PointsSection compras={purchases} selectedMonth={selectedMonth} />
      </div>
    </div>
  );
};


export default PointsPage;

