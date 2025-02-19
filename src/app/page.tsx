import Chat from "@/components/chat";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import IdProvider from "@/lib/Context";
import { IngestData } from "@/lib/ingestData";
import { MessageCircle } from "lucide-react";

export default function Home() {
  IngestData()
  return (
    <IdProvider>
      <div className="flex bg-gray-50 min-h-screen items-center justify-center">
        <Popover>
          <PopoverContent align="start" className="w-full sm:w-[440px] mr-4">
            <Chat />
          </PopoverContent>
          <PopoverTrigger asChild className="fixed bottom-4 right-4">
            <Button
              variant="outline"
              className="rounded-full w-16 h-16 aspect-square bg-black hover:bg-gray-700"
            >
              <MessageCircle size={40} className="text-white" />
            </Button>
          </PopoverTrigger>
        </Popover>
      </div>
    </IdProvider>
  );
}
