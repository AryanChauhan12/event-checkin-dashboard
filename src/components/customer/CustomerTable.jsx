import CustomerTableRow from './CustomerTableRow'
import './CustomerTable.css'

const CustomerTable = ({ customers, onView, onEdit, onDelete }) => {
  return (
    <div className="customer-table_wrapper">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th>Project Name</th>
            <th>QR Code</th>
            <th>Event Status</th>
            <th>Assigned Booth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <CustomerTableRow
              key={customer.id}
              customer={customer}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable
