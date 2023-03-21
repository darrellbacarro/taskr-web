import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Flex,
  Text,
} from "@mantine/core";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { cloneElement, useMemo, useState } from "react";
import type { FC } from "react";
import clsx from "clsx";
import { LordIcon } from "./LordIcon";
import Image from "next/image";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useRouter, usePathname } from 'next/navigation';

type SideBarIconProps = {
  active?: boolean;
  size?: number;
  icon?: string;
  activeIcon?: string;
};

const SideBarIcon: FC<SideBarIconProps> = ({
  active,
  size,
  icon,
  activeIcon,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${!!active}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ width: size, height: size }}
      >
        <LordIcon
          src={!!active ? activeIcon : icon}
          trigger="hover"
          target=".sidebar-item"
          colors={{ primary: !!active ? "#228BE6" : "#7F8389" }}
          size={size}
        />
      </motion.div>
    </AnimatePresence>
  );
};

type SideBarItemProps = {
  activeIcon: string;
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  rightElement?: any;
  collapsed?: boolean;
};

const variants: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, zIndex: -5, position: "absolute" },
  initial: { opacity: 0 },
};

const SideBarItem: FC<SideBarItemProps> = ({
  icon,
  label,
  active,
  activeIcon,
  onClick,
  rightElement,
  collapsed,
}) => {
  return (
    <Flex
      className={clsx("sidebar-item", { active: !!active })}
      sx={{ color: "#7F8389", transition: "all 0.5s", position: "relative" }}
      gap="md"
      p="sm"
      mr="sm"
      ml="sm"
      onClick={onClick}
      align="center"
    >
      <SideBarIcon
        size={24}
        active={active}
        icon={icon}
        activeIcon={activeIcon}
      />
      <motion.div
        animate={!!collapsed ? "hidden" : "visible"}
        variants={variants}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        style={{ flex: 1, display: "flex", alignItems: "center" }}
      >
        <Text
          component="div"
          sx={{ transition: "all 0.5s", flex: 1 }}
          fz="md"
          fw={500}
          lh={1}
        >
          {label}
        </Text>
        {rightElement &&
          cloneElement(rightElement, {
            className: "sidebar-item-right-element",
          })}
      </motion.div>
      {!!active && (
        <motion.div className="highlighter" layoutId="nav-highlight" />
      )}
    </Flex>
  );
};

type NavLink = {
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
  rightElement?: React.ReactNode;
};

const navItems: NavLink[] = [
  {
    label: "Dashboard",
    icon: "/images/animated/sidebar/27-view-4-outline.json",
    activeIcon: "/images/animated/sidebar/27-view-4-solid.json",
    path: "/u",
  },
  {
    label: "Chat",
    icon: "/images/animated/sidebar/47-chat-outline.json",
    activeIcon: "/images/animated/sidebar/47-chat-solid.json",
    path: "/u/chats",
  },
  {
    label: "Projects",
    icon: "/images/animated/sidebar/44-folder-outline.json",
    activeIcon: "/images/animated/sidebar/44-folder-solid.json",
    path: "/u/projects",
  },
  {
    label: "Tasks",
    icon: "/images/animated/sidebar/31-check-outline.json",
    activeIcon: "/images/animated/sidebar/31-check-solid.json",
    path: "/u/tasks",
    rightElement: (
      <ActionIcon variant="transparent" onClick={(e) => e.stopPropagation()}>
        <LordIcon
          src="/images/animated/sidebar/49-plus-circle-outline.json"
          trigger="click"
          colors={{ primary: "#8A8E94", secondary: "#228BE6" }}
        />
      </ActionIcon>
    ),
  },
  {
    label: "Notifications",
    icon: "/images/animated/sidebar/46-notification-bell-outline.json",
    activeIcon: "/images/animated/sidebar/46-notification-bell-solid.json",
    path: "/u/notifications",
  },
  {
    label: "Team",
    icon: "/images/animated/sidebar/96-groups-outline.json",
    activeIcon: "/images/animated/sidebar/96-groups-solid.json",
    path: "/u/team",
  },
  {
    label: "Settings",
    icon: "/images/animated/sidebar/63-settings-cog-outline.json",
    activeIcon: "/images/animated/sidebar/63-settings-cog-solid.json",
    path: "/u/settings",
  },
];

export const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const activePath = useMemo(() => pathname, [pathname]);

  return (
    <motion.div
      layout
      className="sidebar-container"
      data-iscollapsed={isCollapsed}
    >
      <Flex p="md" align={"center"} justify={isCollapsed ? "center" : "flex-start"} gap="sm">
        <Avatar color={"gray"} size="md" radius={"xl"}>
          <Image
            src="/logo/Transparent.png"
            alt="logo"
            width={48}
            height={48}
            priority
          />
        </Avatar>
        {
          !isCollapsed && (
            <Text fw={900} fz={24} color="#787878">
              Taskr
            </Text>
          )
        }
      </Flex>
      <Divider color="#F4F5F5" pb="md" />
      {navItems.map((item) => (
        <SideBarItem
          key={item.path}
          active={item.path === activePath}
          icon={item.icon}
          activeIcon={item.activeIcon}
          label={item.label}
          onClick={() => router.push(item.path)}
          rightElement={item.rightElement}
          collapsed={isCollapsed}
        />
      ))}
      <Box sx={{ flex: 1 }} />
      <ActionIcon
        onClick={() => setIsCollapsed(!isCollapsed)}
        m="md"
        radius={"xl"}
        size="xl"
      >
        {isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
      </ActionIcon>
    </motion.div>
  );
};
