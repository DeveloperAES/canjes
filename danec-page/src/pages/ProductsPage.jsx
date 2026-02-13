import { useEffect, useState } from "react";
import { getCatalog } from "../api/productsApi";
import { postUserCartApi } from "../api/userApi";
import ProductCard from "../components/ui/ProductCard";
import ProductModal from "../components/ui/ProductModal";
import FiltersSidebar from "../components/ui/FiltersSidebar";
import QuantityModal from "../components/ui/QuantityModal";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { useLoading } from "../context/LoadingContext";
import { Filter } from "lucide-react";

import { ButtonNavigateCart } from "../components/ui/buttons/ButtonCart";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToQuantity, setProductToQuantity] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { userPoints, refreshSession, cartTotal } = useAuth();
  const { showModal } = useModal();
  const { showLoading, hideLoading } = useLoading();

  const totalPoints = userPoints?.Response?.oResponse[0]?.total || 0;
  const effectivePoints = totalPoints - (cartTotal || 0);

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    minPrice: "",
    maxPrice: "",
    sort: ""
  });

  useEffect(() => {
    (async () => {
      showLoading();
      setLoading(true);
      try {
        const data = await getCatalog();
        setProducts(data.Response.oResponse || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
        hideLoading();
      }
    })();
  }, []);

  const availableCategories = [...new Set(products.map((p) => p.category))].filter(Boolean);
  const maxProductPrice = Math.max(...products.map(p => p.price), 0);
  const minProductPrice = Math.min(...products.map(p => p.price), 0);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredProducts = products.filter((p) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(query)) return false;
    }
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(p.category)) return false;
    }
    if (filters.minPrice) {
      if (p.price < parseFloat(filters.minPrice)) return false;
    }
    if (filters.maxPrice) {
      if (p.price > parseFloat(filters.maxPrice)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (filters.sort === "price_asc") return a.price - b.price;
    if (filters.sort === "price_desc") return b.price - a.price;
    return 0;
  });

  const handleAdd = (product) => {
    setProductToQuantity(product);
  };

  const handleConfirmAdd = async (product, quantity) => {
    showLoading();
    try {
      const res = await postUserCartApi({ product: product.id, quantity: quantity });
      
      // Check for business logic errors in response
      const sRetorno = res?.Response?.sRetorno || "";
      if (sRetorno.toLowerCase().includes("supera el stock")) {
          showModal({
              type: 'error',
              title: 'Aviso de Stock',
              message: sRetorno
          });
          return;
      }

      showModal({
        type: 'success',
        title: 'PRODUCTO AGREGADO',
        message: `${quantity} unidad(es) de "${product.name}" añadidas al carrito.`
      });
      await refreshSession();
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.message || "Error al agregar producto";
      showModal({
        type: 'error',
        title: 'ERROR',
        message: msg
      });
    } finally {
      hideLoading();
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => setSelectedProduct(null);

  if (loading) return null; // Loading handler is global
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <FiltersSidebar
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          filters={filters}
          onChange={handleFilterChange}
          categories={availableCategories}
          priceRange={{ min: minProductPrice, max: maxProductPrice }}
        />

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Productos</h1>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 p-3 rounded-xl font-bold text-gray-700 shadow-sm active:scale-95 transition-all"
              >
                <Filter size={18} />
                FILTROS
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
              <div className="text-gray-400 font-bold text-xl">Sin resultados</div>
              <p className="text-gray-400 mt-2">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={handleAdd} onView={handleView} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
      
      <QuantityModal 
        isOpen={!!productToQuantity}
        onClose={() => setProductToQuantity(null)}
        product={productToQuantity}
        onConfirm={handleConfirmAdd}
        availablePoints={effectivePoints}
      />
    </div>
  );
}
