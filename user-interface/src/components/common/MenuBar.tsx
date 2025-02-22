"use client";
import { consts } from "@/utils/consts";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Tooltip,
} from "@heroui/react";
import { ChevronDown, Loader2, LogOut, Users } from "lucide-react";
import { ThemeSwitcher } from "../providers/Theme";
import { mutation } from "@/services/graphql/apollo";
import { LogoutUser } from "@/services/graphql/user.query-doc";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function MenuBar() {
  let router = useRouter();
  let pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let loading = false;
  const menuItems: IMenuItem[] = [
    {
      parent: null,
      name: "خانه",
      link: "/Shell",
      isReadOnly: false,
      isHidden: false,
      children: [],
    },
    {
      parent: null,
      name: "مدیریت کاربران",
      link: null,
      isReadOnly: false,
      isHidden: false,
      children: [
        {
          parent: "Security",
          name: "لیست کاربران",
          link: "/Shell/Security",
          description: "لیست کاملی از کاربران را در اختیار شما میگذارد",
          isReadOnly: false,
          isHidden: false,
          children: [],
        },
      ],
    },
  ];
  function onLogout() {
    loading = true;
    mutation(LogoutUser, {}).then(() => {
      loading = false;
      router.push("/");
    });
  }
  function checkActivation(links: string[]) {
    console.log(pathName);

    return links.some((x) => x === pathName);
  }
  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isBordered
      maxWidth="full"
      className="bg-slate-100 dark:bg-slate-950 opacity-95 rounded-2xl"
    >
      <NavbarContent justify="start">
        <NavbarBrand>
          <p className="font-bold text-cyan-800 dark:text-cyan-400 text-2xl">
            {consts.menu.brandTitle}
          </p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="w-full gap-4 hidden lg:flex" justify="center">
        {menuItems
          .filter((q) => !q.isHidden)
          .map((item, pIndex) => {
            return item.children.length > 0 ? (
              <Dropdown key={pIndex}>
                <NavbarItem
                  isActive={checkActivation([item.link!]) && !item.isReadOnly}
                  className="group"
                >
                  <DropdownTrigger>
                    <Button
                      isDisabled={item.isReadOnly}
                      color="primary"
                      className="text-cyan-800 dark:text-cyan-400 text-lg group-data-[active]:bg-cyan-700 group-data-[active]:text-white dark:group-data-[active]:bg-cyan-200 dark:group-data-[active]:text-black"
                      endContent={<ChevronDown></ChevronDown>}
                      radius="lg"
                      variant="flat"
                    >
                      {item.name}
                    </Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu
                  aria-label="UserManagement features"
                  itemClasses={{
                    base: "gap-4",
                  }}
                >
                  {item.children
                    .filter((x) => !x.isHidden)
                    .map((child, cIndex) => {
                      return (
                        <DropdownItem
                          isReadOnly={child.isReadOnly}
                          href={child.link!}
                          className="text-cyan-800 dark:text-cyan-400"
                          key={cIndex}
                          description={child.description}
                          startContent={<Users></Users>}
                        >
                          {child.name}
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </Dropdown>
            ) : (
              <NavbarItem
                key={pIndex}
                isActive={checkActivation([item.link!]) && !item.isReadOnly}
                className="group"
              >
                <Link
                  isDisabled={item.isReadOnly}
                  aria-current="page"
                  href={item.link!}
                >
                  <Button
                    isDisabled={item.isReadOnly}
                    color="primary"
                    className="text-cyan-800 dark:text-cyan-400  text-lg group-data-[active]:bg-cyan-700 group-data-[active]:text-white dark:group-data-[active]:bg-cyan-200 dark:group-data-[active]:text-black"
                    radius="lg"
                    variant="flat"
                  >
                    {item.name}
                  </Button>
                </Link>
              </NavbarItem>
            );
          })}
      </NavbarContent>
      <NavbarContent justify="end" className="w-full hidden sm:flex">
        <NavbarItem className="w-full">
          <Tooltip content={consts.menu.logout}>
            <Button
              variant="flat"
              color="primary"
              className="text-cyan-800 dark:text-cyan-400 group-data-[active]:bg-cyan-700 group-data-[active]:text-white dark:group-data-[active]:bg-cyan-200 dark:group-data-[active]:text-black"
              onPress={onLogout}
            >
              {loading ? (
                <Loader2></Loader2>
              ) : (
                <LogOut className="rotate-180"></LogOut>
              )}
            </Button>
          </Tooltip>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitcher></ThemeSwitcher>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="lg:hidden w-auto bg-cyan-300 dark:bg-blue-950 h-[2.5rem] px-2"
      />
      <NavbarMenu className="mt-5">
        <NavbarMenuItems menuItems={menuItems}></NavbarMenuItems>
      </NavbarMenu>
    </Navbar>
  );
}

export function NavbarMenuItems({ menuItems }: { menuItems: IMenuItem[] }) {
  return (
    <div className="">
      {menuItems.map((item, index) => (
        <NavbarMenuItem className="text-center" key={`${item.name}-${index}`}>
          {item.link ? (
            <Link
              className="w-[90%] my-2"
              color={"primary"}
              href={item.link}
              size="lg"
            >
              <Button className="w-full" color="primary" variant="flat">
                {item.name}
              </Button>
            </Link>
          ) : (
            <div className="w-full mt-3">
              <Button
                className="w-full"
                isDisabled
                color="default"
                variant="flat"
              >
                {item.name}
              </Button>
            </div>
          )}
          {item.children.length > 0 && (
            <ul className="list-none">
              {NavbarMenuItems({ menuItems: item.children })}
            </ul>
          )}
        </NavbarMenuItem>
      ))}
    </div>
  );
}

interface IMenuItem {
  name: string;
  parent: string | null;
  link: string | null;
  description?: string | null;
  isHidden: boolean;
  isReadOnly: boolean;
  children: IMenuItem[];
}
