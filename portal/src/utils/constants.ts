import Projects from "@/components/Projects"
import UserManagement from "@/components/UserManagement"
import { TabConfiguration } from "@/utils/types"
import { IconLayoutDashboard, IconUser } from '@tabler/icons-react';

export const PASSWORD_SETTINGS = {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
}
export const MEMBER_DASHBOARD_TABS: TabConfiguration[] = [{ name: "Project List", component: Projects, id: "project-list", icon: IconLayoutDashboard }]
export const ADMIN_DASHBOARD_TABS: TabConfiguration[] = [...MEMBER_DASHBOARD_TABS, { name: "User Management", component: UserManagement, id: "user-management", icon: IconUser }]
