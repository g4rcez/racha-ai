import React from "react";
import { AppConfig } from "~/components/admin/app-config";
import { MobileLayout } from "~/components/admin/mobile.layout";
import { ClientSide } from "~/components/client-side";

export default function AdminLayout(page: React.ReactElement) {
    return (
        <ClientSide>
            <AppConfig />
            <MobileLayout>{page}</MobileLayout>
        </ClientSide>
    );
}
