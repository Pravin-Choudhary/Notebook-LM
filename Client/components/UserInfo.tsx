"use client";
import {
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {session?.user?.image ? (
            <Image
              src={session?.user?.image}
              width={30}
              height={20}
              alt="UserLogo"
              className="rounded-full object-contain"
            />
          ) : (
            <div>{session?.user?.name![0] || "user"}</div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full min-w-0 bg-sidebar "
          align="start"
        >
          <DropdownMenuLabel>
            {session?.user?.image ? (
              <Image
                src={session?.user?.image}
                width={30}
                height={20}
                alt="UserLogo"
                className="rounded-full object-contain"
              />
            ) : (
              <div>{session?.user?.name![0] || "user"}</div>
            )}

            <div className="flex flex-col overflow-hidden">
              <span className="font-[400] text-sm truncate">
                {session?.user?.name}
              </span>
              <span className="text-muted-foreground text-sm truncate">
                {session?.user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-3 font-medium text-sm">
            <DropdownMenuItem onClick={async () => {
               await signOut();
               redirect('/signin');
            }}>
              <LogOut className="text-red-700 text-base" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
