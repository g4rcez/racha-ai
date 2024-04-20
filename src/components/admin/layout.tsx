import React, { PropsWithChildren } from "react";
import { AppConfig } from "~/components/admin/app-config";
import { MobileLayout } from "~/components/admin/mobile.layout";
import { ClientSide } from "~/components/client-side";

const AdminLayoutRoot = (props: PropsWithChildren) => (
    <ClientSide>
        <AppConfig />
        <MobileLayout children={props.children} />
    </ClientSide>
);

export default function AdminLayout(page: React.ReactElement) {
    return <AdminLayoutRoot>{page}</AdminLayoutRoot>;
}
