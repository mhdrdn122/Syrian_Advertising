import RoadSignsContainer from "../../Components/RoadSigns/RoadSignsContainer";
import RoadSignsPdf from "../../Components/RoadSigns/RoadSignsPdf";
import { Button } from "@/components/ui/button";
import { useGetRoadSignsQuery } from "../../RtkQuery/Slice/RoadSings/RoadSingsApi";

const RoadSignsPage = () => {
  // const {data : roadSigns , isLoading : isRoadSignsLoading} = useGetRoadSignsQuery()


 

  return (
    <div className="p-4" dir="">
      {/* <Button
              onClick={() => {
                const { generatePDF } = RoadSignsPdf({ roadSigns: roadSigns || [] });
                generatePDF();
              }}
              className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={isRoadSignsLoading || !roadSigns?.length}
            >
              تحميل ملف تموضع جميع اللوحات  اللوحات
            </Button> */}
     
      <RoadSignsContainer
      />
    </div>
  );
};

export default RoadSignsPage;
