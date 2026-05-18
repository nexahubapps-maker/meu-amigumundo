import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-12 h-12">
        <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="Avatar" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar className="w-12 h-12">
        <AvatarImage src="https://picsum.photos/seed/avatar2/100/100" alt="Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  );
}