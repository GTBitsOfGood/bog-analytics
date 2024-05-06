import { TabConfiguration } from "@/utils/types"
import { IconLayoutDashboard, IconUser, IconPencil } from '@tabler/icons-react';

export const PASSWORD_SETTINGS = {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
}
export const MEMBER_DASHBOARD_TABS: TabConfiguration[] = [{ name: "Project List", id: "project-list", icon: IconLayoutDashboard },
{ name: "Create Project", id: "create-project", icon: IconPencil }
]
export const ADMIN_DASHBOARD_TABS: TabConfiguration[] = [...MEMBER_DASHBOARD_TABS, { name: "User Management", id: "user-management", icon: IconUser }]
