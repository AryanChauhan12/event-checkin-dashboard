import { getStatusBadgeClass } from "@utils/statusBadge";
import "./CustomerTableRow.css";

const CustomerTableRow = ({ customer, onView, onEdit, onDelete }) => {
  const badgeClass = getStatusBadgeClass(customer.eventStatus);

  return (
    <tr>
      <td>{customer.customerName}</td>
      <td>{customer.mobile}</td>
      <td>{customer.email}</td>
      <td>{customer.projectName}</td>
      <td>{customer.qrCode}</td>
      <td>
        <span className={badgeClass}>{customer.eventStatus}</span>
      </td>
      <td>{customer.assignedBooth || "—"}</td>
      <td>
        <div className="customer-table_actions">
          <button type="button" onClick={() => onView(customer)}>
            View
          </button>
          <button type="button" onClick={() => onEdit(customer)}>
            Edit
          </button>
          <button
            type="button"
            className="customer-table_action-delete"
            onClick={() => onDelete(customer)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerTableRow;
