import AdminLayout from "~/components/admin/layout";
import { CreateOrderItem } from "~/components/products/create-order-item";

const AppProductIndexPage = () => <CreateOrderItem id={null} />;

AppProductIndexPage.getLayout = AdminLayout;

export default AppProductIndexPage;
