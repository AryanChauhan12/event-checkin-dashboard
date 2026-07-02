import { useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { ROUTES } from "@constants";
import "./Header.css";

const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.CUSTOMERS]: "Customers",
  [ROUTES.QR_SCANNER]: "QR Scanner",
  [ROUTES.BOOTH_ASSIGNMENT]: "Booth Assignment",
  [ROUTES.CUSTOMER_STATUS]: "Customer Status",
};

const CURRENT_DATE = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const Header = ({ onToggleSidebar }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <header className="header">
      <div className="header_left">
        <button
          type="button"
          className="header_menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span />
          <span />
          <span />
        </button>

        <div>
          <h1 className="header_title">{pageTitle}</h1>
          <span className="header_date">{CURRENT_DATE}</span>
        </div>
      </div>

      <div className="header_right">
        <span className="header_user-name">{currentUser?.name}</span>

        <div className="header_profile">
          <span className="header_profile-trigger" aria-label="Account">
            {currentUser?.name?.charAt(0) ?? "A"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
