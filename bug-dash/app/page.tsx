import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
export default function Home() {
   return (
      <>
         <div>
            <Button>New issue</Button>
            <Button variant="outline">Filter</Button>
            <Button variant="secondary">Assign</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger">Delete</Button>
            <Button size="sm">Small</Button>
            <Button disabled>Disabled</Button>
         </div>
      </>
   );
}
