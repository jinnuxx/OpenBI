import { ProLayoutProps } from '@ant-design/pro-components';
// import OpenBI_icon from '../public/OpenBI_icon.svg';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "light",
  "colorPrimary": "#1677FF",
  "layout": "top",
  "contentWidth": "Fluid",
  "fixedHeader": true,
  "fixSiderbar": true,
  "pwa": true,
  "logo": "logo.svg",
  "token": {},
  "splitMenus": false,
  "siderMenuType": "sub",
  "title": "OpenBI",
};

export default Settings;
