import { EyeIcon, EyeOff } from "lucide-react";
import React, { useState } from "react";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/core/button";
import { ColorPicker } from "~/components/form/color-picker";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Title } from "~/components/core/typography";
import { useTranslations } from "~/i18n";
import { hexToHslProperty } from "~/lib/dom";
import { Preferences } from "~/store/preferences.store";
import DefaultTheme from "~/styles/default.json";
import { NextPageWithLayout } from "~/types";

const Customize = () => {
  const [state, dispatch] = Preferences.use();
  const i18n = useTranslations();
  const [hide, setHide] = useState(false);
  const changeFromRGB = (rgb: string) => {
    const bg = hexToHslProperty(rgb);
    return dispatch.colors({ main: { bg: bg } });
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const color = e.currentTarget.dataset.color ?? "";
    return !color.includes(",")
      ? changeFromRGB(color)
      : dispatch.colors({ main: { bg: color } });
  };

  const colors = [
    { name: i18n.get("colorDefault"), color: DefaultTheme.colors.main.bg },
  ];

  return (
    <section className="w-full">
      <section className="flex w-full flex-row flex-nowrap items-center justify-between">
        <Title>{i18n.get("welcomeCustomizeTitle")}</Title>
        <Button
          theme="transparent"
          onClick={() => setHide((p) => !p)}
          icon={hide ? <EyeIcon size={20} /> : <EyeOff size={20} />}
        />
      </section>
      {hide ? null : (
        <ul className="grid grid-cols-2 gap-4 mt-4 whitespace-pre-wrap">
          <li>
            <ColorPicker
              onChangeColor={changeFromRGB}
              color={state.colors.main?.bg}
            />
          </li>
          {colors.map((x) => {
            const backgroundColor = x.color.includes(",")
              ? `hsl(${x.color})`
              : x.color;
            return (
              <Button
                style={{ backgroundColor }}
                onClick={onClick}
                data-color={x.color}
                key={`color-${x.name}`}
                theme="transparent"
                children={x.name}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
};

const MyName = () => {
  const [state, dispatch] = Preferences.use();
  const i18n = useTranslations();
  return (
    <header className="flex flex-col gap-2">
      <Form className="flex flex-col gap-4">
        <Input
          required
          name="name"
          value={state.name}
          title={i18n.get("welcomeInputTitle")}
          placeholder={i18n.get("welcomeInputPlaceholder")}
          onChange={(e) => dispatch.onChangeName(e.target.value)}
        />
      </Form>
    </header>
  );
};

const ConfigPage: NextPageWithLayout = () => {
  return (
    <main className="w-full flex flex-col gap-6">
      <MyName />
      <Customize />
    </main>
  );
};

ConfigPage.getLayout = AdminLayout;

export default ConfigPage;
