import { BanknoteIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HistoryItem } from "~/components/admin/history/history-item";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/core/button";
import { Card } from "~/components/core/card";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { i18n, useTranslations } from "~/i18n";
import { noop } from "~/lib/fn";
import { Is } from "sidekicker";
import { Statistics } from "~/models/statistics";
import { OrdersMapper } from "~/services/orders/orders.mapper";
import { Friends } from "~/store/friends.store";
import { History } from "~/store/history.store";
import { Preferences } from "~/store/preferences.store";
import { NextPageWithLayout } from "~/types";

const StatisticCard = ({
  value,
  label,
  format = "money",
}: {
  value: number;
  label: string;
  format?: keyof typeof i18n.format | null;
}) => {
  const formatter = format === null ? noop.fn : (i18n.format[format] as any);
  return (
    <li className="w-full flex flex-nowrap bg-card-bg gap-4 border rounded-md border-card-border shadow-sm">
      <div className="h-full rounded-l-md p-6 bg-main-bg text-white">
        <BanknoteIcon />
      </div>
      <div className="flex-1 flex-col flex items-start rounded-r-md flex-shrink justify-center w-full">
        <span className="text-xs">{label}</span>
        <span className="text-lg">{formatter(value)}</span>
      </div>
    </li>
  );
};

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

const AppPage: NextPageWithLayout = () => {
  const i18n = useTranslations();
  const [user, dispatch] = Preferences.use((s) => s.user);
  const [friendsState] = Friends.use();
  const [history, historyDispatch] = History.use();
  const [firstStateName, setFirstNameState] = useState("");
  const items = useMemo(
    () =>
      OrdersMapper.parseOrdersAsResponse(
        history.items,
        friendsState.users.toArray().concat(user),
      ),
    [history.items, friendsState.users],
  );
  const name = user.name;
  const statistics = Statistics.summary(items, user);

  useEffect(() => {
    setFirstNameState(name);
    historyDispatch.refresh(History.init());
  }, []);

  if (firstStateName === "")
    return <WelcomePage onFillName={() => setFirstNameState(name)} />;

  return (
    <main className="flex flex-col gap-8">
      {firstStateName === "" ? (
        <header className="flex flex-col gap-2">
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
        </header>
      ) : null}
      {items.length === 0 && Is.nil(statistics) ? (
        <Card
          title={i18n.get("historyTitle")}
          description="Você não possui histórico"
          className="flex items-center justify-center flex-col"
        />
      ) : (
        <div className="@container">
          <ul className="grid-cols-1 lg:grid-cols-2 gap-4 hidden @xs:grid">
            <StatisticCard
              value={statistics!.total}
              label="Valor total das contas"
            />
            <StatisticCard
              value={statistics!.ownTotal}
              label="Valor pago por você"
            />
            <StatisticCard
              value={statistics!.economic}
              label="Quanto você economizou"
            />
            <StatisticCard
              format={null}
              value={statistics!.places}
              label="Lugares já visitados"
            />
          </ul>
        </div>
      )}
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
};

AppPage.getLayout = AdminLayout;

export default AppPage;
