import { FC, useState } from "react";
import {
  Panel,
  PanelHeader,
  NavIdProps,
  PanelHeaderBack,
  Group,
  Header,
  SimpleCell,
  Switch,
  CellButton,
} from "@vkontakte/vkui";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  Icon24Share,
  Icon28HelpCircleOutline,
  Icon28InfoCircleOutline,
} from "@vkontakte/icons";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../constants";
import { useLink } from "../hook";
import { parseURLSearchParamsForGetLaunchParams } from "@vkontakte/vk-bridge";
import { disableNotifications, enableNotifications, shareApp } from "../utils";

const getLanguageNameByCode = (code: string) => {
  const lang = LANGUAGES.find((lang) => lang.code === code);
  return lang ? lang.name : "";
};

export const Profile: FC<NavIdProps> = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const { openLink } = useLink();
  const { t, i18n } = useTranslation();
  const { vk_are_notifications_enabled, vk_is_recommended } =
    parseURLSearchParamsForGetLaunchParams(window.location.search);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    Boolean(vk_are_notifications_enabled)
  );
  const [appIsRecommended, setAppIsRecommended] = useState<boolean>(
    Boolean(vk_is_recommended)
  );

  const toggleNotificationsEnabled = async (enabled: boolean) => {
    try {
      const res = await (enabled
        ? enableNotifications()
        : disableNotifications());

      if (res) {
        setNotificationsEnabled(!notificationsEnabled);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecommendeApp = async () => {
    try {
      if (await shareApp()) {
        setAppIsRecommended(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
      >
        {t("menu.title")}
      </PanelHeader>

      <Group
        header={<Header mode="secondary">{t("menu.subtitles.menu")}</Header>}
      >
        {/* <SimpleCell expandable="auto" before={<Icon28Notifications />}>
          {t("menu.menu.notifications")}
        </SimpleCell> */}
        <SimpleCell
          onClick={() => openLink("https://vk.com/im?media=&sel=-227970967")}
          expandable="auto"
          before={<Icon28HelpCircleOutline />}
        >
          {t("menu.menu.techSupport")}
        </SimpleCell>
        <SimpleCell
          onClick={() => routeNavigator.push("/about-app")}
          expandable="auto"
          before={<Icon28InfoCircleOutline />}
        >
          {t("menu.menu.aboutAppAndCerts")}
        </SimpleCell>
      </Group>

      <Group
        header={
          <Header mode="secondary">{t("menu.subtitles.settings")}</Header>
        }
      >
        <SimpleCell
          onClick={() => routeNavigator.push("/change-language")}
          expandable="auto"
          indicator={getLanguageNameByCode(i18n.language)}
        >
          {t("menu.settings.lang")}
        </SimpleCell>
        <SimpleCell
          Component="label"
          after={
            <Switch
              checked={notificationsEnabled}
              onChange={(e) => toggleNotificationsEnabled(e.target.checked)}
            />
          }
        >
          {t("menu.settings.pushNotifications")}
        </SimpleCell>
      </Group>

      {!appIsRecommended && (
        <Group>
          <CellButton
            centered
            before={<Icon24Share />}
            mode="primary"
            onClick={handleRecommendeApp}
          >
            {t("menu.settings.recommendApp")}
          </CellButton>
        </Group>
      )}
    </Panel>
  );
};
