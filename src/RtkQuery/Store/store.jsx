import { configureStore } from "@reduxjs/toolkit";
import { AuthSlice } from "../Slice/Auth/AuthSlice";
import { TemplateSlice } from "../Slice/Template/TemplateSlice";
import { RoadSignsSlice } from "../Slice/RoadSings/RoadSingsSlice";
import { CustomersSlice } from "../Slice/Customers/CustomersSlice";
import { SummariesSlice } from "../Slice/Summaries/SummariesSlice";
import { BrokersSlice } from "../Slice/Brokers/BrokersSlice";
import { UsersSlice } from "../Slice/Users/UsersSlice";
import { paymentsSlice } from "../Slice/payments/paymentsSlice";
import { BookingSlice } from "../Slice/Booking/BookingSlice";
import { ContractsSlice } from "../Slice/contracts/ContractsSlice";
import { OrdersSlice } from "../Slice/orders/ordersApi";
import { CitiesAndRegionsSlice } from "../Slice/CitiesAndRegions/CitiesAndRegionsSlice";
import { ReportSlice } from "../Slice/Report/ReportSlice";

const store = configureStore({
  reducer: {
    [AuthSlice.reducerPath]: AuthSlice.reducer,
    [TemplateSlice.reducerPath]: TemplateSlice.reducer,
    [RoadSignsSlice.reducerPath]: RoadSignsSlice.reducer,
    [CustomersSlice.reducerPath]: CustomersSlice.reducer,
    [UsersSlice.reducerPath]: UsersSlice.reducer,
    [SummariesSlice.reducerPath]: SummariesSlice.reducer,
    [BrokersSlice.reducerPath]: BrokersSlice.reducer,
    [paymentsSlice.reducerPath]: paymentsSlice.reducer,
    [BookingSlice.reducerPath]: BookingSlice.reducer,
    [ContractsSlice.reducerPath]: ContractsSlice.reducer,
    [OrdersSlice.reducerPath]: OrdersSlice.reducer,
    [CitiesAndRegionsSlice.reducerPath]: CitiesAndRegionsSlice.reducer,
    [ReportSlice.reducerPath]: ReportSlice.reducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthSlice.middleware,
      TemplateSlice.middleware,
      RoadSignsSlice.middleware,
      CustomersSlice.middleware,
      UsersSlice.middleware,
      SummariesSlice.middleware,
      BrokersSlice.middleware,
      paymentsSlice.middleware, 
      BookingSlice.middleware, 
      ContractsSlice.middleware, 
      OrdersSlice.middleware, 
      CitiesAndRegionsSlice.middleware, 
      ReportSlice.middleware, 

    ),
});

export default store;
