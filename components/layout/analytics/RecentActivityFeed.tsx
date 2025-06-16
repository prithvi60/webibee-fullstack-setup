"use client"

import { useEffect } from "react";

const RecentActivityFeed = () => {
  const tableHeadings = Object.getOwnPropertyNames(recentActivities[0])

  return (
    <div className="w-full h-full padding md:col-span-2">
      <table className='border-2 border-black p-3 w-full'>
        <thead className='border-b-2 border-black pb-2'>
          <tr className='text-center'>
            {tableHeadings.map((head, id) => (
              <th key={id} className='border-r-2 border-black capitalize'>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentActivities.map((activity, idx) => (
            <tr key={idx} className='border-b-2 border-black pb-2 space-x-2 text-center text-sm md:text-base px-2'>
              <td className='border-r-2 border-black'>{activity.time}</td>
              <td className='border-r-2 border-black'>{activity.event}</td>
              <td className='border-r-2 border-black'>{activity?.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentActivityFeed



const recentActivities = [
  { time: "12 mins ago", event: "New user signed up", user: "@ritika.07" },
  { time: "2 hrs ago", event: "AI report generated", user: "Exported as PDF" },
  { time: "Yesterday", event: "User upgraded to Pro Plan" },
  { time: "2 days ago", event: "Admin added new team member", user: "@john.dev" }
]
