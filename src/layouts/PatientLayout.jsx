import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import {
    BellRing,
    Bot,
    CalendarPlus,
    Clock3,
    HeartPulse,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageCircleMore,
    PlusCircle,
    UserRound,
    X,
  } from "lucide-react";
  
  import {
    Link,
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
  } from "react-router-dom";
  
  const HOKU_PRIMARY = "#1E63C6";
  const HOKU_SECONDARY = "#B7CF35";
  
  const navigationGroups = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          path: "/patient/dashboard",
          icon: LayoutDashboard,
          end: true,
        },
        {
          label: "Book Appointment",
          path: "/patient/book-appointment",
          icon: CalendarPlus,
        },
        {
          label: "Appointment History",
          path: "/patient/appointment-history",
          icon: History,
        },
      ],
    },
    {
      title: "Medication",
      items: [
        {
          label: "Medication Reminders",
          path: "/patient/medication-reminders",
          icon: BellRing,
        },
        {
          label: "Add Reminder",
          path: "/patient/medication-reminders/add",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "AI Healthcare",
      items: [
        {
          label: "Symptom Checker",
          path: "/patient/symptom-checker",
          icon: Bot,
        },
        {
          label: "AI Health Chatbot",
          path: "/patient/ai-chatbot",
          icon: MessageCircleMore,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "My Profile",
          path: "/patient/profile",
          icon: UserRound,
        },
      ],
    },
  ];
  
  const pageTitles = {
    "/patient/dashboard": {
      title: "Patient Dashboard",
      description:
        "View appointments, medication reminders, and healthcare activity.",
    },
    "/patient/book-appointment": {
      title: "Book Appointment",
      description:
        "Find a specialist and schedule your healthcare appointment.",
    },
    "/patient/appointment-history": {
      title: "Appointment History",
      description:
        "Review your previous, upcoming, and cancelled appointments.",
    },
    "/patient/medication-reminders": {
      title: "Medication Reminders",
      description:
        "Manage your active and completed medication schedules.",
    },
    "/patient/medication-reminders/add": {
      title: "Add Medication Reminder",
      description:
        "Create a new medication schedule and reminder.",
    },
    "/patient/symptom-checker": {
      title: "AI Symptom Checker",
      description:
        "Enter your symptoms to receive general healthcare guidance.",
    },
    "/patient/ai-chatbot": {
      title: "AI Health Chatbot",
      description:
        "Ask general health questions through the HOKU AI assistant.",
    },
    "/patient/profile": {
      title: "My Profile",
      description:
        "Manage your personal and contact information.",
    },
  };
  
  function getStoredPatient() {
    try {
      const storedPatient =
        localStorage.getItem("patient-user");
  
      if (!storedPatient) {
        return null;
      }
  
      return JSON.parse(storedPatient);
    } catch {
      return null;
    }
  }
  
  function getInitials(name) {
    if (!name) {
      return "PT";
    }
  
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }
  
  function SidebarContent({
    patient,
    onNavigate,
    onLogout,
  }) {
    const patientName =
      patient?.fullName ||
      patient?.name ||
      "HOKU Patient";
  
    const patientEmail =
      patient?.email ||
      "patient@hokuhealth.com";
  
    return (
      <div className="flex h-full flex-col bg-white">
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center border-b border-slate-100 px-5">
          <Link
            to="/patient/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-3"
          >
            <div
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{
                backgroundColor:
                  HOKU_PRIMARY,
              }}
            >
              <HeartPulse className="h-5 w-5" />
  
              <span
                className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white"
                style={{
                  backgroundColor:
                    HOKU_SECONDARY,
                }}
              />
            </div>
  
            <div>
              <p className="text-lg font-bold leading-none text-slate-900">
                HOKU
              </p>
  
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E63C6]">
                Patient Portal
              </p>
            </div>
          </Link>
        </div>
  
        {/* Patient */}
        <div className="px-4 pt-5">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{
                backgroundColor:
                  HOKU_PRIMARY,
              }}
            >
              {getInitials(patientName)}
            </div>
  
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">
                {patientName}
              </p>
  
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {patientEmail}
              </p>
            </div>
          </div>
        </div>
  
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-6">
            {navigationGroups.map(
              (group) => (
                <div key={group.title}>
                  <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {group.title}
                  </p>
  
                  <div className="space-y-1">
                    {group.items.map(
                      (item) => {
                        const Icon =
                          item.icon;
  
                        return (
                          <NavLink
                            key={
                              item.path
                            }
                            to={item.path}
                            end={item.end}
                            onClick={
                              onNavigate
                            }
                            className={({
                              isActive,
                            }) =>
                              `group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                                isActive
                                  ? "bg-[#1E63C6] text-white shadow-sm"
                                  : "text-slate-600 hover:bg-[#1E63C6]/5 hover:text-[#1E63C6]"
                              }`
                            }
                          >
                            {({
                              isActive,
                            }) => (
                              <>
                                <Icon
                                  className={`h-[18px] w-[18px] shrink-0 ${
                                    isActive
                                      ? "text-white"
                                      : "text-slate-400 transition group-hover:text-[#1E63C6]"
                                  }`}
                                />
  
                                <span>
                                  {
                                    item.label
                                  }
                                </span>
                              </>
                            )}
                          </NavLink>
                        );
                      }
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </nav>
  
        {/* Quick reminder */}
        <div className="px-4 pb-4">
          <Link
            to="/patient/medication-reminders/add"
            onClick={onNavigate}
            className="block rounded-2xl bg-[#B7CF35]/15 p-4 transition hover:bg-[#B7CF35]/20"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B7CF35]/30 text-[#61720E]">
                <Clock3 className="h-4 w-4" />
              </div>
  
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Add medicine reminder
                </p>
  
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Never miss your medicine
                  schedule.
                </p>
              </div>
            </div>
          </Link>
        </div>
  
        {/* Logout */}
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </div>
    );
  }
  
  export default function PatientLayout() {
    const location = useLocation();
    const navigate = useNavigate();
  
    const [
      isSidebarOpen,
      setIsSidebarOpen,
    ] = useState(false);
  
    const [patient, setPatient] =
      useState(() => getStoredPatient());
  
    const currentPage = useMemo(
      () =>
        pageTitles[location.pathname] || {
          title: "Patient Portal",
          description:
            "Manage your healthcare services.",
        },
      [location.pathname]
    );
  
    const patientName =
      patient?.fullName ||
      patient?.name ||
      "HOKU Patient";
  
    useEffect(() => {
      setIsSidebarOpen(false);
    }, [location.pathname]);
  
    useEffect(() => {
      document.body.style.overflow =
        isSidebarOpen ? "hidden" : "";
  
      return () => {
        document.body.style.overflow = "";
      };
    }, [isSidebarOpen]);
  
    useEffect(() => {
      const handleStorage = () => {
        setPatient(getStoredPatient());
      };
  
      window.addEventListener(
        "storage",
        handleStorage
      );
  
      return () => {
        window.removeEventListener(
          "storage",
          handleStorage
        );
      };
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem(
        "patient-token"
      );
  
      localStorage.removeItem(
        "patient-user"
      );
  
      navigate("/patient/login", {
        replace: true,
      });
    };
  
    return (
      <div className="min-h-dvh bg-[#F8FAFC] font-['Inter']">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-slate-200 bg-white lg:block">
          <SidebarContent
            patient={patient}
            onLogout={handleLogout}
          />
        </aside>
  
        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            isSidebarOpen
              ? "pointer-events-auto"
              : "pointer-events-none"
          }`}
          aria-hidden={!isSidebarOpen}
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() =>
              setIsSidebarOpen(false)
            }
            className={`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity ${
              isSidebarOpen
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
  
          <aside
            className={`absolute inset-y-0 left-0 w-[min(86vw,300px)] border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                setIsSidebarOpen(false)
              }
              aria-label="Close sidebar"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
  
            <SidebarContent
              patient={patient}
              onNavigate={() =>
                setIsSidebarOpen(false)
              }
              onLogout={handleLogout}
            />
          </aside>
        </div>
  
        {/* Main area */}
        <div className="lg:pl-[280px]">
          {/* Topbar */}
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setIsSidebarOpen(true)
                  }
                  aria-label="Open patient navigation"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5 hover:text-[#1E63C6] lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
  
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                    {currentPage.title}
                  </h1>
  
                  <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">
                    {currentPage.description}
                  </p>
                </div>
              </div>
  
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5 hover:text-[#1E63C6]"
                >
                  <BellRing className="h-[18px] w-[18px]" />
  
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                </button>
  
                <Link
                  to="/patient/profile"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5 sm:pr-3"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{
                      backgroundColor:
                        HOKU_PRIMARY,
                    }}
                  >
                    {getInitials(
                      patientName
                    )}
                  </div>
  
                  <div className="hidden min-w-0 sm:block">
                    <p className="max-w-28 truncate text-xs font-bold text-slate-800">
                      {patientName}
                    </p>
  
                    <p className="text-[10px] text-slate-400">
                      Patient
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </header>
  
          {/* Page content */}
          <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-[1500px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }