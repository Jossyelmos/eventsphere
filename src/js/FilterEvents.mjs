// FilterEvents.mjs

export default class FilterEvents {
  static apply(events, filters) {
    const { search, category, date, attendance, rank } = filters;

    return events.filter(event => {
      const title = event.title?.toLowerCase() || "";
      const eventDate = new Date(event.start);
      const today = new Date();

      // SEARCH FILTER
      const matchSearch = search
        ? title.includes(search.toLowerCase())
        : true;

      // CATEGORY FILTER
      const matchCategory = category
        ? event.category === category
        : true;

      // DATE FILTER (still here if you use it)
      let matchDate = true;
      if (date === "today") {
        matchDate = eventDate.toDateString() === today.toDateString();
      } else if (date === "week") {
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        matchDate = eventDate >= today && eventDate <= nextWeek;
      } else if (date === "month") {
        matchDate =
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear();
      }

      // ATTENDANCE FILTER
      const attendanceValue = event.phq_attendance || 0;
      let matchAttendance = true;

      if (attendance === "small") {
        matchAttendance = attendanceValue < 500;
      } else if (attendance === "medium") {
        matchAttendance = attendanceValue >= 500 && attendanceValue <= 5000;
      } else if (attendance === "large") {
        matchAttendance = attendanceValue > 5000;
      }

      // RANK FILTER
      const rankValue = event.rank || 0;
      let matchRank = true;

      if (rank === "low") {
        matchRank = rankValue >= 1 && rankValue <= 30;
      } else if (rank === "mid") {
        matchRank = rankValue >= 31 && rankValue <= 70;
      } else if (rank === "high") {
        matchRank = rankValue >= 71 && rankValue <= 100;
      }

      return matchSearch && matchCategory && matchDate && matchAttendance && matchRank;
    });
  }
}
