"use client";
import { BanknoteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { HistoryItem } from "~/components/admin/history/history-item";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { useTranslations } from "~/i18n";
import { History } from "~/store/history.store";
import { Preferences } from "~/store/preferences.store";

const WelcomePage = (props: { onFillName: () => void }) => {
  const i18n = useTranslations();
  const [name, dispatch] = Preferences.use((s) => s.user.name);
  return (
    <main className="flex flex-col gap-6 pb-8 h-full items-center justify-center">
      <header className="flex flex-col gap-2">
        <Form onSubmit={props.onFillName} className="flex flex-col gap-4">
          <Input
            required
            name="name"
            value={name}
            title={i18n.get("welcomeInputTitle")}
            placeholder={i18n.get("welcomeInputPlaceholder")}
            onChange={(e) => dispatch.onChangeName(e.target.value)}
          />
          <Button type="submit">Salvar</Button>
        </Form>
      </header>
    </main>
  );
};

export default function AppPage() {
  const i18n = useTranslations();
  const [name, dispatch] = Preferences.use((s) => s.user.name);
  const [history, historyDispatch] = History.use();
  const items = history.items;
  const [firstStateName, setFirstNameState] = useState("");

  useEffect(() => {
    setFirstNameState(name);
    historyDispatch.refresh(History.init());
  }, []);

  if (firstStateName === "")
    return <WelcomePage onFillName={() => setFirstNameState(name)} />;

  return (
    <main className="flex flex-col gap-6 pb-8">
      <header className="flex flex-col gap-2">
        {firstStateName === "" ? (
          <Form className="flex flex-col gap-4">
            <Input
              required
              name="name"
              value={name}
              title={i18n.get("welcomeInputTitle")}
              placeholder={i18n.get("welcomeInputPlaceholder")}
              onChange={(e) => dispatch.onChangeName(e.target.value)}
            />
          </Form>
        ) : null}
      </header>
      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={`item-${i}`}
            className="w-full flex flex-nowrap border rounded-md border-card-border shadow-sm"
          >
            <div className="h-full rounded-l-md p-6 bg-main-bg text-white">
              <BanknoteIcon />
            </div>
            <div className="flex-1 bg-card-bg flex items-center rounded-r-md flex-shrink justify-center w-full text-black">
              R$ 99,99
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 ? null : (
        <Card
          title={i18n.get("historyTitle")}
          description={i18n.get("historicDescription")}
        >
          <ul className="mt-4 space-y-6">
            {items.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}
