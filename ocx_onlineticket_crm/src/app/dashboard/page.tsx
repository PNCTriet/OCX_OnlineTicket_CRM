import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {/* Card 1 */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.618762 8.28001C0.596262 8.24001 0.596262 8.19001 0.618762 8.15001C0.825012 7.81126 4.19376 1.31501 11 1.31501C17.8063 1.31501 21.175 7.81126 21.3813 8.15001C21.4038 8.19001 21.4038 8.24001 21.3813 8.28001C21.175 8.61876 17.8063 15.1156 11 15.1156ZM11 3.16501C6.80626 3.16501 3.25501 6.66001 2.80001 8.15001C3.25501 9.64001 6.80626 13.135 11 13.135C15.1938 13.135 18.745 9.64001 19.2 8.15001C18.745 6.66001 15.1938 3.16501 11 3.16501Z" fill=""/>
                <path d="M11 10.7213C9.36876 10.7213 8.04001 9.39253 8.04001 7.76128C8.04001 6.13003 9.36876 4.80128 11 4.80128C12.6313 4.80128 13.96 6.13003 13.96 7.76128C13.96 9.39253 12.6313 10.7213 11 10.7213ZM11 6.05128C10.1538 6.05128 9.29001 6.91378 9.29001 7.76128C9.29001 8.60878 10.1538 9.47128 11 9.47128C11.8463 9.47128 12.71 8.60878 12.71 7.76128C12.71 6.91378 11.8463 6.05128 11 6.05128Z" fill=""/>
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  $3.456K
                </h4>
                <span className="text-sm font-medium">Total views</span>
              </div>

              <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
                0.43%
                <svg className="fill-meta-3" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" fill=""/>
                </svg>
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg className="fill-primary dark:fill-white" width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5312 13.1281 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.3625 19.8687 11.0406 19.5469 11.0406 19.1562C11.0406 18.7656 11.3625 18.4437 11.7531 18.4437C12.1438 18.4437 12.4656 18.7656 12.4656 19.1562C12.4656 19.5469 12.1438 19.8687 11.7531 19.8687Z" fill=""/>
                <path d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5312 6.59683 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.8312 19.8687 4.50935 19.5469 4.50935 19.1562C4.50935 18.7656 4.8312 18.4437 5.22183 18.4437C5.61245 18.4437 5.9343 18.7656 5.9343 19.1562C5.9343 19.5469 5.61245 19.8687 5.22183 19.8687Z" fill=""/>
                <path d="M19.0062 0.618744H17.9156C16.4437 0.618744 15.2406 1.82187 15.2406 3.29374V4.64062C15.2406 6.11249 16.4437 7.31562 17.9156 7.31562H19.0062C20.4781 7.31562 21.6812 6.11249 21.6812 4.64062V3.29374C21.6812 1.82187 20.4781 0.618744 19.0062 0.618744Z" fill=""/>
                <path d="M11.7531 0.618744H10.6625C9.19062 0.618744 7.98749 1.82187 7.98749 3.29374V4.64062C7.98749 6.11249 9.19062 7.31562 10.6625 7.31562H11.7531C13.225 7.31562 14.4281 6.11249 14.4281 4.64062V3.29374C14.4281 1.82187 13.225 0.618744 11.7531 0.618744Z" fill=""/>
                <path d="M5.22183 0.618744H4.1312C2.65935 0.618744 1.45622 1.82187 1.45622 3.29374V4.64062C1.45622 6.11249 2.65935 7.31562 4.1312 7.31562H5.22183C6.69368 7.31562 7.8968 6.11249 7.8968 4.64062V3.29374C7.8968 1.82187 6.69368 0.618744 5.22183 0.618744Z" fill=""/>
                <path d="M19.0062 9.675H17.9156C16.4437 9.675 15.2406 10.8781 15.2406 12.35V13.6969C15.2406 15.1687 16.4437 16.3719 17.9156 16.3719H19.0062C20.4781 16.3719 21.6812 15.1687 21.6812 13.6969V12.35C21.6812 10.8781 20.4781 9.675 19.0062 9.675Z" fill=""/>
                <path d="M11.7531 9.675H10.6625C9.19062 9.675 7.98749 10.8781 7.98749 12.35V13.6969C7.98749 15.1687 9.19062 16.3719 10.6625 16.3719H11.7531C13.225 16.3719 14.4281 15.1687 14.4281 13.6969V12.35C14.4281 10.8781 13.225 9.675 11.7531 9.675Z" fill=""/>
                <path d="M5.22183 9.675H4.1312C2.65935 9.675 1.45622 10.8781 1.45622 12.35V13.6969C1.45622 15.1687 2.65935 16.3719 4.1312 16.3719H5.22183C6.69368 16.3719 7.8968 15.1687 7.8968 13.6969V12.35C7.8968 10.8781 6.69368 9.675 5.22183 9.675Z" fill=""/>
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  2.450
                </h4>
                <span className="text-sm font-medium">Total Product</span>
              </div>

              <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
                2.59%
                <svg className="fill-meta-3" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" fill=""/>
                </svg>
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10H3M21 10L12 1M21 10L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  3.456
                </h4>
                <span className="text-sm font-medium">Total Sales</span>
              </div>

              <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
                0.95%
                <svg className="fill-meta-3" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" fill=""/>
                </svg>
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg className="fill-primary dark:fill-white" width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.18418 8.03751H9.44268C9.25275 8.16951 9.22756 8.38128 9.22756 8.66328C9.22756 8.93928 9.25275 9.15105 9.44268 9.28305H7.18418C7.01418 9.15105 6.989 8.93928 6.989 8.66328C6.989 8.38128 7.01418 8.16951 7.18418 8.03751Z" fill=""/>
                <path d="M15.8124 9.6875C15.8124 9.4145 15.8124 9.20175 15.8124 8.9595C15.8124 8.7255 15.8292 8.51275 15.8534 8.31025H12.3589C12.3164 8.31025 12.2727 8.31025 12.2292 8.31025C12.1857 8.31025 12.1422 8.31025 12.0997 8.31025H8.60522C8.56172 8.31025 8.51822 8.31025 8.47472 8.31025C8.43122 8.31025 8.38772 8.31025 8.34522 8.31025H4.85072C4.82656 8.51275 4.84337 8.7255 4.84337 8.9595C4.84337 9.20175 4.84337 9.4145 4.84337 9.6875C4.84337 9.9185 4.82656 10.121 4.85072 10.3235H8.34522C8.38772 10.3235 8.43122 10.3235 8.47472 10.3235C8.51822 10.3235 8.56172 10.3235 8.60522 10.3235H12.0997C12.1422 10.3235 12.1857 10.3235 12.2292 10.3235C12.2727 10.3235 12.3164 10.3235 12.3589 10.3235H15.8534C15.8292 10.121 15.8124 9.9185 15.8124 9.6875Z" fill=""/>
                <path d="M15.9843 5.52344H4.85072C4.82656 5.72594 4.84337 5.93869 4.84337 6.17269C4.84337 6.41494 4.84337 6.62769 4.84337 6.90069C4.84337 7.13169 4.82656 7.33419 4.85072 7.53669H15.9843C16.0084 7.33419 15.9916 7.13169 15.9916 6.90069C15.9916 6.62769 15.9916 6.41494 15.9916 6.17269C15.9916 5.93869 16.0084 5.72594 15.9843 5.52344Z" fill=""/>
                <path d="M6.42156 13.9758H1.93412C1.90996 14.1783 1.92678 14.3911 1.92678 14.6251C1.92678 14.8673 1.92678 15.0801 1.92678 15.3531C1.92678 15.5841 1.90996 15.7866 1.93412 15.9891H6.42156C6.44572 15.7866 6.42891 15.5841 6.42891 15.3531C6.42891 15.0801 6.42891 14.8673 6.42891 14.6251C6.42891 14.3911 6.44572 14.1783 6.42156 13.9758Z" fill=""/>
                <path d="M19.9874 11.1656H18.2827C18.2586 11.3681 18.2754 11.5809 18.2754 11.8149C18.2754 12.0571 18.2754 12.2699 18.2754 12.5429C18.2754 12.7739 18.2586 12.9764 18.2827 13.1789H19.9874C20.0116 12.9764 19.9948 12.7739 19.9948 12.5429C19.9948 12.2699 19.9948 12.0571 19.9948 11.8149C19.9948 11.5809 20.0116 11.3681 19.9874 11.1656Z" fill=""/>
                <path d="M9.60928 13.9758H15.8124C15.8366 14.1783 15.8198 14.3911 15.8198 14.6251C15.8198 14.8673 15.8198 15.0801 15.8198 15.3531C15.8198 15.5841 15.8366 15.7866 15.8124 15.9891H9.60928C9.58512 15.7866 9.60194 15.5841 9.60194 15.3531C9.60194 15.0801 9.60194 14.8673 9.60194 14.6251C9.60194 14.3911 9.58512 14.1783 9.60928 13.9758Z" fill=""/>
                <path d="M17.6906 13.9758H21.178C21.2022 14.1783 21.1854 14.3911 21.1854 14.6251C21.1854 14.8673 21.1854 15.0801 21.1854 15.3531C21.1854 15.5841 21.2022 15.7866 21.178 15.9891H17.6906C17.6664 15.7866 17.6832 15.5841 17.6832 15.3531C17.6832 15.0801 17.6832 14.8673 17.6832 14.6251C17.6832 14.3911 17.6664 14.1783 17.6906 13.9758Z" fill=""/>
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  2.450
                </h4>
                <span className="text-sm font-medium">Total Orders</span>
              </div>

              <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
                2.59%
                <svg className="fill-meta-3" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" fill=""/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:mt-11 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-8">
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div>
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Recent Orders
                </h3>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No orders yet. Start creating events to see orders here.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4">
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div>
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Recent Events
                </h3>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No events yet. Create your first event to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 