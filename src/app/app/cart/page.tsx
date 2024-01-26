"use client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { Alert } from "~/components/alert";
import { Button } from "~/components/button";
import { Checkbox } from "~/components/form/checkbox";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { AnnotateProduct } from "~/components/products/annotate-product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table";
import { SectionTitle, Title } from "~/components/typography";
import { SelectConsumerFriends } from "~/components/users/friends";
import { i18n } from "~/i18n";
import { fixed, toFraction } from "~/lib/fn";
import { Cart } from "~/store/cart.store";
import { Preferences } from "~/store/preferences.store";

const bonusAdditional = [0.1, 0.12, 0.15, 0.2];

export default function ComandaPage() {
  const [state, dispatch] = Cart.use();
  const [me] = Preferences.use((x) => x.user);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const submitter = (
      (e.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement
    )?.value;
    if (submitter === "submit")
      Cart.onSubmit(me.id, state, (path) => router.push(path as any));
  };

  const onReset = () => dispatch.set(Cart.getState());

  return (
    <main>
      <Title className="font-bold">{state.title || "Bar sem nome..."}</Title>
      <Form
        onReset={onReset}
        onSubmit={onSubmit}
        className="flex flex-col gap-6"
        onKeyDown={(e) => (e.key === "Enter" ? e.preventDefault() : undefined)}
      >
        <Input
          required
          name="title"
          title="Nome do bar"
          value={state.title}
          placeholder="Meu bar..."
          onChange={dispatch.onChange}
        />
        <section className="flex flex-col gap-2">
          <SectionTitle titleClassName="text-2xl" title="Quem tá na mesa?">
            Selecione quem irá dividir a conta com você
          </SectionTitle>
          <SelectConsumerFriends
            me={me}
            friends={state.users}
            onAdd={dispatch.onAddFriend}
            onDelete={dispatch.onRemoveFriend}
            onChangeUser={dispatch.onChangeUsername}
          />
          <ul className="space-y-4">
            {state.users.arrayMap((user) => {
              const i = user.id === me.id;
              return (
                <li
                  key={`${user.id}-comanda-list`}
                  className={`flex items-center justify-between ${
                    i ? "text-main-bg" : ""
                  }`}
                >
                  <span className="text-lg">
                    {user.name}
                    {i ? " - Eu" : ""}
                  </span>
                  {i ? null : (
                    <Button
                      size="small"
                      theme="transparent-danger"
                      onClick={() => dispatch.removeUser(user)}
                    >
                      <Trash2Icon />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <SectionTitle titleClassName="text-2xl" title="Consumo">
            Adicione aqui os itens consumidos.
          </SectionTitle>
          <AnnotateProduct
            me={me}
            users={state.users}
            justMe={state.justMe}
            product={state.currentProduct}
            setCurrent={dispatch.setCurrent}
            disabled={state.users.size === 0}
            onAddProduct={dispatch.addProduct}
            onRemoveProduct={dispatch.removeProduct}
            onChangeProduct={dispatch.onChangeProduct}
            onChangeConsumedQuantity={dispatch.onChangeConsumedQuantity}
          />
          <ul className="mt-4 space-y-4">
            {state.products.arrayMap((product) => {
              const showAlert = Cart.productWarning(product);
              return (
                <li
                  className="flex flex-col items-center justify-between"
                  key={`product-${product.id}`}
                >
                  <span className="flex w-full items-center justify-between">
                    <button
                      onClick={() => dispatch.setCurrent(product)}
                      className="flex w-full items-center justify-between"
                    >
                      <div className="text-left">
                        <span className="text-xl">{product.name || "-"}</span>
                        <span className="flex gap-2 text-lg">
                          <span>{i18n.format.money(product.price)}</span>
                          <span>{"x"}</span>
                          <span>{product.quantity}</span>
                          <span>{"="}</span>
                          <span>
                            {i18n.format.money(
                              product.quantity * product.price,
                            )}
                          </span>
                        </span>
                      </div>
                    </button>
                    <Button
                      size="small"
                      theme="transparent-danger"
                      onClick={() => dispatch.removeProduct(product)}
                    >
                      <Trash2Icon />
                    </Button>
                  </span>
                  {showAlert ? (
                    <Alert title="Aviso" theme="warn" className="my-6">
                      A soma do consumo é inferior a quantidade total de
                      produtos
                    </Alert>
                  ) : null}
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Pessoa</TableHeader>
                        <TableHeader>Quantidade</TableHeader>
                        <TableHeader>Total</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.consumers.arrayMap((consumer) =>
                        consumer.quantity === 0 ? null : (
                          <TableRow key={`consumer-item-${consumer.id}`}>
                            <TableCell>{consumer.name}</TableCell>
                            <TableCell>
                              {toFraction(consumer.quantity)}
                            </TableCell>
                            <TableCell>
                              {i18n.format.money(fixed(consumer.amount, 2))}
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </li>
              );
            })}
          </ul>
        </section>
        <SectionTitle
          headerClassName="min-w-full"
          titleClassName="text-2xl"
          title="Extras"
        >
          Gorjeta? Couvert? Salvar a localização do bar? Essa sessão vai te
          ajudar nisso
        </SectionTitle>
        <section className="flex flex-wrap gap-4">
          <Checkbox
            checked={state.hasAdditional}
            onChange={dispatch.onChange}
            name="hasAdditional"
          >
            Vai pagar a gorjeta?
          </Checkbox>
          {state.hasAdditional ? (
            <Fragment>
              <div className="grid min-w-full grid-cols-2 items-center justify-center gap-2">
                {bonusAdditional.map((bonus) => {
                  const formatted = i18n.format.percent(bonus);
                  const current = state.additional === formatted;
                  return (
                    <Button
                      key={`bonus-key-${bonus}`}
                      onClick={() => dispatch.onChangeBonus(bonus)}
                      theme={current ? undefined : "muted"}
                    >
                      {formatted}
                    </Button>
                  );
                })}
              </div>
              <Input
                mask="percent"
                name="additional"
                placeholder="10%"
                className="min-w-full"
                value={state.additional}
                onChange={dispatch.onChange}
                title="Outro valor de gorjeta"
              />
            </Fragment>
          ) : null}
        </section>
        <section>
          <div className="flex flex-wrap gap-2">
            <Checkbox
              checked={state.hasCouvert}
              onChange={dispatch.onChange}
              name="hasCouvert"
            >
              Couvert artístico por pessoa?
            </Checkbox>
            {state.hasCouvert ? (
              <Input
                required
                mask="money"
                name="couvert"
                value={state.couvert}
                placeholder="R$ 10,00"
                onChange={dispatch.onChange}
                title="Qual o valor do couvert?"
              />
            ) : null}
          </div>
        </section>
        <Button name="submit" value="submit" type="submit">
          Fechar a conta
        </Button>
        <Button theme="warn" name="reset" value="reset" type="reset">
          Zerar tudo
        </Button>
      </Form>
    </main>
  );
}