import React from 'react';
import { Search20, Notification20, AppSwitcher20 } from '@carbon/icons-react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react';
import cx from 'classnames';

SideNav.displayName = 'SideNav';
SideNavMenu.displayName = 'SideNavMenu';
SideNavMenuItem.displayName = 'SideNavMenuItem';

const Fade16 = () => (
  <svg
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true">
    <path d="M8.24 25.14L7 26.67a14 14 0 0 0 4.18 2.44l.68-1.88a12 12 0 0 1-3.62-2.09zm-4.05-7.07l-2 .35A13.89 13.89 0 0 0 3.86 23l1.73-1a11.9 11.9 0 0 1-1.4-3.93zm7.63-13.31l-.68-1.88A14 14 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59 10L3.86 9a13.89 13.89 0 0 0-1.64 4.54l2 .35A11.9 11.9 0 0 1 5.59 10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
  </svg>
);

class HeaderBar extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: true,
    }
  }


  render() {
    return (
      <Header aria-label="IBM Platform Name">
        <HeaderName
          href="#"
          prefix="Bee" >
          Green
        </HeaderName>
        <HeaderNavigation aria-label="IBM [Platform]">
          {!this.state.loggedIn && <HeaderMenuItem href="#">Sign Up</HeaderMenuItem> }
          { this.state.loggedIn &&
              <HeaderMenuItem href="#">Your shopping at a glance</HeaderMenuItem>
          }
          <HeaderMenuItem href="#">Contribute to our public database</HeaderMenuItem>
          { this.state.loggedIn &&
            <HeaderMenu aria-label="Profile" menuLinkName="Profile">
              <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
              <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
              <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
          </HeaderMenu> 
         }
        </HeaderNavigation>
          { this.state.loggedIn &&
           <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Search"
                onClick={function noRefCheck(){}}
              >
              <Search20/>
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Notifications"
                onClick={function noRefCheck(){}}
              >
                <Notification20/>
              </HeaderGlobalAction>
          </HeaderGlobalBar> 
        }
      </Header>
    );
  }
}
export default HeaderBar;