import { useGetRoadSignsModelQuery } from "../../RtkQuery/Slice/RoadSings/RoadSingsApi";
import LoadingGet from "../../utils/Loading/LoadingGet/LoadingGet";
import SummariesCard from "../Summaries/SummariesCard";

const RoadSignsContainer = () => {
  const { data, isFetching } = useGetRoadSignsModelQuery();

  if (isFetching) {
    return (
      <div className="w-full h-full flex-col flex justify-center items-center">
        <LoadingGet />
        <p>Loading ... </p>
      </div>
    );
  }
  
  return (
    <>
           <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-2  lg:grid-cols-4 gap-4"
        dir="rtl"
      >
        {data?.map((item, ind) => {
          return (
            <SummariesCard
              key={ind}
              title={item.model}
              count={item.count || 0}
              endPoint={`road_signs/${item.model}`}
            />
          );
        })}
      </div>
    </>
  );
};

export default RoadSignsContainer;
