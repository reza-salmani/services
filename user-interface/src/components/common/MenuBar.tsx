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
import { mutation, query } from "@/services/graphql/apollo";
import { GetPages, LogoutUser } from "@/services/graphql/user.query-doc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//================================== main function =====================================
export default function MenuBar() {
  let router = useRouter();
  let pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  let loading = false;

  //#region useEffect
  useEffect(() => {
    query(GetPages).then((res) => {
      let mainPages: any = [];
      res.data.menu.map((page: any) => {
        if (!page.parentId) {
          mainPages = [...mainPages, ...[page]];
        } else {
          let pageExist = mainPages.find(
            (x: any) => x.selfId === page.parentId
          );
          if (pageExist)
            if (!pageExist.children) {
              mainPages.find((x: any) => x.selfId === page.parentId).children =
                [page];
            } else {
              mainPages
                .find((x: any) => x.selfId === page.parentId)
                .children.push(page);
            }
        }
        return page;
      });
      setMenuItems(mainPages);
    });
  }, []);
  //#endregion

  //#region logout
  function onLogout() {
    loading = true;
    mutation(LogoutUser, {}).then(() => {
      loading = false;
      router.push("/");
    });
  }
  //#endregion

  //#region checkActivation
  function checkActivation(links: string[]) {
    return links.some((x) => x === pathName);
  }
  //#endregion

  //#region return section
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
        {menuItems.map((item, pIndex) => {
          return item.children && item.children.length > 0 ? (
            <Dropdown key={pIndex}>
              <NavbarItem
                isActive={
                  checkActivation(item.children.map((x) => x.link!)) &&
                  !item.isReadOnly
                }
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
                    {item.persianName}
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="UserManagement features"
                itemClasses={{
                  base: "gap-4",
                }}
              >
                {item.children.map((child, cIndex) => {
                  return (
                    <DropdownItem
                      isReadOnly={child.isReadOnly}
                      href={child.link!}
                      className={
                        checkActivation([child.link!])
                          ? "bg-cyan-100 dark:bg-cyan-950"
                          : "text-cyan-800 dark:text-cyan-400"
                      }
                      key={cIndex}
                      description={child.description}
                      startContent={<Users></Users>}
                    >
                      {child.persianName}
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
                  {item.persianName}
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
  //#endregion
}

//===================================== recursive menu creator ===============================
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
                {item.persianName}
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
                {item.persianName}
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

//===================================== interfaces ===========================================
interface IMenuItem {
  name: string;
  persianName: string;
  id: string;
  description: string;
  selfId: number;
  parentId: number | null;
  link: string | null;
  isReadOnly: boolean;
  roles: string[];
  children: IMenuItem[];
}
