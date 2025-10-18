import AddressList from '../components/AddressList';

function MyAddress() {
  return (
    <section className="container py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">My Addresses</h2>
        <p className="text-muted mb-0">
          Manage your saved delivery addresses here 🏠
        </p>
      </div>

      <div className="mx-auto" style={{ maxWidth: "700px" }}>
        <AddressList mode="manage" />
      </div>
    </section>
  );
}

export default MyAddress;
