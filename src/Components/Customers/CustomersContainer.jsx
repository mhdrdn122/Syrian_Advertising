import { useGetCustomersQuery } from "../../RtkQuery/Slice/Customers/CustomersApi";
import CustomerCard from "./CustomerCard";
import LoadingGet from "../../utils/Loading/LoadingGet/LoadingGet";

const CustomersContainer = ({customers , isFetching}) => {
  // const { data, isFetching } = useGetCustomersQuery();

  if (isFetching) {
    return (
      <div className="w-full h-full flex-col flex justify-center items-center">
        <LoadingGet />
        <p>Loading ... </p>
      </div>
    );
  }
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 p-2  lg:grid-cols-3 gap-4"
      dir="rtl"
    >
      {customers.map((item, ind) => {
        return (
          <CustomerCard
            key={ind}
            id={item.id}
            fullName={item.full_name}
            companyName={item.company_name}
            phone_number={item.phone_number}
            discount={item.discount}
            createdAt={item.created_at}
            updatedAt={item.updated_at}
          />
        );
      })}
    </div>
  );
};

export default CustomersContainer;
