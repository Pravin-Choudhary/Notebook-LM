
import { Sidebar, SidebarContent } from "./ui/sidebar";
import { ContentPanel } from "./ContentPanel";

export const SideBarContentPanel = () => {

  return (
        <>
            <Sidebar>
                  <SidebarContent>
                            <ContentPanel/>
                  </SidebarContent>
            </Sidebar>
        </>
  );
};
