/**
 * 菜单
 */
import {checkAccess} from "@/utils/authorize"

interface MenuItem {
    name: string,
    path: string,
    icon: string,
    show: boolean,
    permission?: string,
    children?: Array<MenuItem>
}

/**
 * 获取左侧导航菜单
 */
function fetchNavigateMenus(): MenuItem[] {
    return [
        {
            name: '仪表板',
            path: '/dashboard',
            icon: 'bi bi-grid-fill',
            show: true
        },
        {
            name: '多语言示例',
            path: '/example/i18n',
            icon: 'bi bi-translate',
            show: true,
            children: []
        },
        {
            name: '图表示例',
            path: '/example/chart',
            icon: 'bi bi-bar-chart',
            show: true,
            children: []
        },
        {
            name: '系统管理',
            path: '/settlement',
            icon: 'bi bi-gear-fill',
            show: true,
            children: [
                {
                    name: '用户管理',
                    path: '/setting/user',
                    icon: 'bi bi-people-fill',
                    show: true,
                    children: []
                },
                {
                    name: '角色管理',
                    path: '/setting/role',
                    icon: 'bi bi-person-check-fill',
                    show: true,
                    children: []
                },
                {
                    name: '权限管理',
                    path: '/setting/permission',
                    icon: 'bi bi-card-list',
                    show: true,
                    children: []
                },
                {
                    name: '后台路由',
                    path: '/setting/route',
                    icon: 'bi bi-diagram-3',
                    show: true,
                    children: []
                }
            ]
        }
    ]
}

/**
 * 提取已授权的菜单列表
 * @param {Array} menus 菜单列表
 * @return {Array}
 */
function fetchMenus(menus: MenuItem[]) {
    const items = []
    for (const menu of menus) {
        let item = null
        if (menu?.permission !== undefined) {
            if (checkAccess(menu.permission)) {
                item = menu
            }
        } else {
            item = menu
        }
        if (item !== null) {
            if (menu?.children && menu.children.length > 0) {
                item.children = fetchMenus(menu.children)
            } else {
                item.children = []
            }
            items.push(item)
        }
    }
    return items
}

export {
    fetchNavigateMenus,
    fetchMenus
}
