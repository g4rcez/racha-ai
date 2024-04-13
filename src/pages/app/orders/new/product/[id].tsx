import { useRouter } from "next/router";
import AdminLayout from "~/components/admin/layout";
import { CreateOrderItem } from "~/components/products/create-order-item";

const AppProductIndexPage = () => {
  const router = useRouter();
  return <CreateOrderItem id={router.query.id as string} />;
};

AppProductIndexPage.getLayout = AdminLayout;

export default AppProductIndexPage;
