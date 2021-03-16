export default [
  { path: '/system', redirect: '/system/branch' },

  { path: '/system/staff', component: 'staff/list', access: 'menu:system-user', title: 'app.common.staffList' },
  { path: '/system/staff/creation', component: 'staff/single', layout: { hideMenu: true }, title: 'app.common.staffCreation' },
  { path: '/system/staff/:id', component: 'staff/layout',
    routes: [
      { path: '/system/staff/:id/basic',  component: 'staff/single', layout: { hideMenu: true } },
      { path: '/system/staff/:id/customer', component: 'staff/customer', layout: { hideMenu: true } },
      { path: '/system/staff/:id/order',  component: 'staff/order', layout: { hideMenu: true } }
    ]
  },
  { path: '/system/branch', component: 'branch/list', access: 'menu:system-department', title: 'app.common.branchList' },
  { path: '/system/branch/creation', component: 'branch/single', title: 'app.common.branchSingle', layout: { hideMenu: true } },
  { path: '/system/branch/:id', component: 'branch/single', layout: { hideMenu: true }, title: 'app.common.branchEdit' },
  { path: '/system/role', access: 'menu:system-role', component: 'role/list' },
  { path: '/system/role/creation', component: 'role/single', layout: { hideMenu: true }, title: 'app.common.addRole' },
  { path: '/system/role/:id', component: 'role/single', layout: { hideMenu: true }, title: 'app.common.roleManage' },
]
