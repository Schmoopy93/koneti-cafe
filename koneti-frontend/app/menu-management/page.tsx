import MenuManagementPage from "@/components/menu/MenuManagementPage";
import { ProtectedRoute } from "@/contexts/ProtectedRoute";

export default function Page() {
  return (
      <ProtectedRoute>
          <MenuManagementPage />;
      </ProtectedRoute>
  )
}
