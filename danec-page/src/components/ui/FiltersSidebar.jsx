import React from "react";
import { X, Filter } from "lucide-react";

export default function FiltersSidebar({
  isOpen,
  onClose,
  filters = {
    search: "",
    categories: [],
    minPrice: "",
    maxPrice: "",
    sort: ""
  },
  onChange,
  categories = [],
  priceRange = { min: 0, max: 1000 }
}) {

  const handleCategoryChange = (cat) => {
    const currentCats = filters.categories || [];
    const exists = currentCats.includes(cat);
    let newCats;
    if (exists) {
      newCats = currentCats.filter((c) => c !== cat);
    } else {
      newCats = [...currentCats, cat];
    }
    onChange("categories", newCats);
  };

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between lg:hidden mb-6">
        <h4 className="text-xl font-bold text-gray-800">Filtros</h4>
        <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-black">
          <X size={24} />
        </button>
      </div>

      <h4 className="hidden lg:block mt-0 text-lg font-bold mb-6 text-gray-800 uppercase tracking-wider">Filtros</h4>

      <div className="flex-1 overflow-y-auto px-2 space-y-8 pb-2">
        {/* Search */}
        <section>
          <div className="mb-3 text-sm font-bold text-gray-700 uppercase tracking-tight">Buscar</div>
          <div className="relative">
            <input
              type="text"
              placeholder="Nombre del producto..."
              className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#f70030] focus:border-transparent outline-none transition-all"
              value={filters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>
        </section>

        {/* Categories */}
        {/* <section>
          <div className="mb-3 text-sm font-bold text-gray-700 uppercase tracking-tight">Categoría</div>
          <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto custom-scrollbar">
            {categories.map((cat) => (
              <label key={cat} className="group text-sm flex items-center cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  className="w-4 h-4 mr-3 rounded border-gray-300 text-[#f70030] focus:ring-[#f70030]"
                  type="checkbox"
                  checked={filters.categories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span className="text-gray-600 group-hover:text-black transition-colors">{cat}</span>
              </label>
            ))}
            {categories.length === 0 && (
              <div className="text-gray-400 text-xs italic p-2">Cargando categorías...</div>
            )}
          </div>
        </section> */}

        {/* Price Range */}
        <section>
          <div className="mb-4 text-sm font-bold text-gray-700 uppercase tracking-tight">Rango de Puntos</div>

          <div className="px-2">
            <div className="relative h-1.5 bg-gray-100 rounded-full mb-8">
              {/* Active Range Track */}
              <div
                className="absolute h-full bg-[#f70030] rounded-full"
                style={{
                  left: `${((filters.minPrice || priceRange.min) / priceRange.max) * 100}%`,
                  right: `${100 - ((filters.maxPrice || priceRange.max) / priceRange.max) * 100}%`
                }}
              ></div>

              {/* Range Inputs */}
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.minPrice || priceRange.min}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), (filters.maxPrice || priceRange.max) - 1);
                  handleInputChange("minPrice", val);
                }}
                className="absolute w-full h-full cursor-pointer z-20 range-slider-thumb-custom appearance-none bg-transparent"
              />
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.maxPrice || priceRange.max}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), (filters.minPrice || priceRange.min) + 1);
                  handleInputChange("maxPrice", val);
                }}
                className="absolute w-full h-full cursor-pointer z-20 range-slider-thumb-custom appearance-none bg-transparent"
              />
            </div>

            {/* Inputs for precision */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="relative">
                <span className="absolute right-3 top-2.5 text-[10px] text-gray-400 font-bold">PTS</span>
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#f70030] focus:border-transparent outline-none"
                  value={filters.minPrice}
                  onChange={(e) => handleInputChange("minPrice", e.target.value)}
                />
              </div>
              <div className="relative">
                <span className="absolute right-3 top-2.5 text-[10px] text-gray-400 font-bold">PTS</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#f70030] focus:border-transparent outline-none"
                  value={filters.maxPrice}
                  onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sort */}
        <section>
          <div className="mb-3 text-sm font-bold text-gray-700 uppercase tracking-tight">Ordenar por</div>
          <select
            className="w-full p-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#f70030] focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
            value={filters.sort}
            onChange={(e) => handleInputChange("sort", e.target.value)}
          >
            <option value="">Relevancia</option>
            <option value="price_asc">Puntos: menor a mayor</option>
            <option value="price_desc">Puntos: mayor a menor</option>
          </select>
        </section>
      </div>

      <div className="lg:hidden mt-auto pt-6">
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#f70030] text-white font-bold rounded-xl shadow-lg shadow-red-100 hover:brightness-110 active:scale-95 transition-all"
        >
          APLICAR FILTROS
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-76 shrink-0 h-fit bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-24">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-100 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div 
          className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-6 transition-transform duration-300 ease-out shadow-2xl ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
