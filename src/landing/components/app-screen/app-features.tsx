import { motion, type MotionProps, type Variant } from "framer-motion";
import React, { lazy, PropsWithChildren, useId } from "react";
import { EditUser } from "~/components/users/friends";
import { AppFrame } from "~/landing/components/app-frame";
import { LandingLogo } from "~/landing/components/landing-logo";
import { noop } from "~/lib/fn";

function DeviceUserIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 23a3 3 0 100-6 3 3 0 000 6zm-1 2a4 4 0 00-4 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a4 4 0 00-4-4h-2z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v24a4.002 4.002 0 01-3.01 3.877c-.535.136-.99-.325-.99-.877s.474-.98.959-1.244A2 2 0 0025 28V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 001.041 1.756C8.525 30.02 9 30.448 9 31s-.455 1.013-.99.877A4.002 4.002 0 015 28V4z"
        fill="#A3A3A3"
      />
    </svg>
  );
}

function DeviceNotificationIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#A3A3A3"
      />
      <path
        d="M9 8a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H11a2 2 0 01-2-2V8z"
        fill="#737373"
      />
    </svg>
  );
}

function DeviceTouchIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  let id = useId();

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient
          id={`${id}-gradient`}
          x1={14}
          y1={14.5}
          x2={7}
          y2={17}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#737373" />
          <stop offset={1} stopColor="#D4D4D4" stopOpacity={0} />
        </linearGradient>
      </defs>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v13h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h4v2H9a4 4 0 01-4-4V4z"
        fill="#A3A3A3"
      />
      <path
        d="M7 22c0-4.694 3.5-8 8-8"
        stroke={`url(#${id}-gradient)`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 20l.217-5.513a1.431 1.431 0 00-2.85-.226L17.5 21.5l-1.51-1.51a2.107 2.107 0 00-2.98 0 .024.024 0 00-.005.024l3.083 9.25A4 4 0 0019.883 32H25a4 4 0 004-4v-5a3 3 0 00-3-3h-5z"
        fill="#A3A3A3"
      />
    </svg>
  );
}

const MotionAppScreenBody = motion(AppFrame.Body);

interface CustomAnimationProps {
  isForwards: boolean;
  changeCount: number;
}

const maxZIndex = 2147483647;

const bodyVariantBackwards: Variant = {
  opacity: 0.4,
  scale: 0.8,
  zIndex: 0,
  filter: "blur(4px)",
  transition: { duration: 0.4 },
};

const bodyVariantForwards: Variant = (custom: CustomAnimationProps) => ({
  y: "100%",
  zIndex: maxZIndex - custom.changeCount,
  transition: { duration: 0.4 },
});

const bodyAnimation: MotionProps = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: {
    initial: (custom: CustomAnimationProps, ...props) =>
      custom.isForwards
        ? bodyVariantForwards(custom, ...props)
        : bodyVariantBackwards,
    animate: (custom: CustomAnimationProps) => ({
      y: "0%",
      opacity: 1,
      scale: 1,
      zIndex: maxZIndex / 2 - custom.changeCount,
      filter: "blur(0px)",
      transition: { duration: 0.4 },
    }),
    exit: (custom: CustomAnimationProps, ...props) =>
      custom.isForwards
        ? bodyVariantBackwards
        : bodyVariantForwards(custom, ...props),
  },
};

type ScreenProps =
  | {
      animated: true;
      custom: CustomAnimationProps;
    }
  | { animated?: false };

export const ScreenContainer = (props: PropsWithChildren) => (
  <div className="px-4 py-2 flex flex-col gap-4 pointer-events-none select-none">
    {props.children}
  </div>
);

const users = [
  { id: "id1", name: "Beltrano", createdAt: new Date() },
  { id: "id2", name: "Ciclano", createdAt: new Date() },
  { id: "id4", name: "Eulano", createdAt: new Date() },
  { id: "id0", name: "Fulano", createdAt: new Date() },
  { id: "id3", name: "Zeltrano", createdAt: new Date() },
];

const FriendsScreen = (props: ScreenProps) => (
  <AppFrame logo={<LandingLogo title="Meus amigos" />} className="w-full">
    <MotionAppScreenBody
      {...(props.animated ? { ...bodyAnimation, custom: props.custom } : {})}
    >
      <ScreenContainer>
        <p>Os amigos que já racharam contas com você.</p>
        <ul>
          {users.map((user, index) => (
            <EditUser
              index={index + 1}
              key={user.id}
              user={user}
              onChangeUser={noop.fn}
              onDeleteUser={noop.fn}
              ownerId=""
            />
          ))}
        </ul>
      </ScreenContainer>
    </MotionAppScreenBody>
  </AppFrame>
);

const ComandaPage = lazy(() => import("~/app/app/cart/page"));

function ComandaAppScreen(props: ScreenProps) {
  return (
    <AppFrame logo={<LandingLogo title="Comanda" />} className="w-full">
      <MotionAppScreenBody
        {...(props.animated ? { ...bodyAnimation, custom: props.custom } : {})}
      >
        <ScreenContainer>
          <ComandaPage />
        </ScreenContainer>
      </MotionAppScreenBody>
    </AppFrame>
  );
}

const ConfigurationAppScreen = lazy(() => import("~/app/app/config/page"));

const ConfigurationScreen = (props: ScreenProps) => (
  <AppFrame logo={<LandingLogo title="Configurações" />} className="w-full">
    <MotionAppScreenBody
      {...(props.animated ? { ...bodyAnimation, custom: props.custom } : {})}
    >
      <ScreenContainer>
        <ConfigurationAppScreen />
      </ScreenContainer>
    </MotionAppScreenBody>
  </AppFrame>
);

export const features = [
  {
    name: "Meus amigos",
    description:
      "Você pode convidar seus amigos para dividir as contas com você e facilitar na hora de criar seus grupos, contas e comandas.",
    icon: DeviceUserIcon,
    screen: FriendsScreen,
  },
  {
    name: "Comandas e grupos",
    description:
      "Com o racha aí você poderá criar grupos de amigos, comandas de mesas e outros tipos de gastos para poder gerenciar. Seja com os amigos, seja sozinho, o racha aí vai te ajudar.",
    icon: DeviceNotificationIcon,
    screen: ComandaAppScreen,
  },
  {
    name: "Faça do seu jeito",
    description:
      "O racha aí permite você deixar ele com a sua cara. Você pode editar as cores, os atalhos, dar apelidos para seus amigos.",
    icon: DeviceTouchIcon,
    screen: ConfigurationScreen,
  },
];
