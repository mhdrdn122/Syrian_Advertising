
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

const HeaderComponent = ( {setShow ,title , titleBtn}) => {
  return (
        <div className="flex my-6 px-3 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Icon icon="mdi:template" className="text-blue-500" />
              {title}
            </h1>
            <Button
              onClick={() => setShow(true)}
              className="gap-2 text-sm sm:text-base"
            >
              <Icon icon="mdi:plus" />
              {titleBtn}
            </Button>
          </div>
  )
}

export default HeaderComponent