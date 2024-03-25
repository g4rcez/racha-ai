import { GetServerSidePropsContext } from "next/types";
import { useEffect } from "react";
import AdminLayout from "~/components/admin/layout";
import { isUuid } from "~/lib/fn";
import { fakeSession } from "~/lib/http";
import { OrdersService } from "~/services/orders/orders.service";

const serverSideProps = async (userId: string, orderId: string) => {
  if (userId === "" && orderId === "") {
    return { order: null };
  }
  const hasAuthorization = await OrdersService.authorizedUser(userId);
  if (!hasAuthorization) {
    return { order: null };
  }
  const order = await OrdersService.getById(orderId);
  return order.isSuccess()
    ? { order: order.success as never }
    : { order: null };
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const uuid = context.query.id as string;
  if (!isUuid(uuid)) {
    return serverSideProps("", "");
  }
  const session = fakeSession;
  if (session === null) return { props: serverSideProps("", "") };
  const id = session.user?.id;
  if (!id) return { props: serverSideProps("", "") };
  return { props: serverSideProps(id, uuid) };
};

function OrdersByIdPage(props: any) {
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <pre>
      <code>{JSON.stringify(props, null, 4)}</code>
    </pre>
  );
}

OrdersByIdPage.getLayout = AdminLayout;

export default OrdersByIdPage;
