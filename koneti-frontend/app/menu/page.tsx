import Menu from "@/components/menu/Menu"; // tvoja postojeća komponenta

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default async function MenuPage() {
  try {
    // ✅ SSR fetch kategorija i pića (nema čekanja na useEffect)
    const [catRes, drinkRes] = await Promise.all([
      fetch(`${API_URL}/categories`, { cache: "no-store" }),
      fetch(`${API_URL}/drinks`, { cache: "no-store" }),
    ]);

    const [categories, drinks] = await Promise.all([
      catRes.json(),
      drinkRes.json(),
    ]);

    return <Menu initialCategories={categories} initialDrinks={drinks} />;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return <div>Failed to load menu data.</div>;
  }
}

