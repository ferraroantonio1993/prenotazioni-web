import { BOOKING_CONFIG } from '../lib/constants';

const CalendarLegend: React.FC = () => (
  <div className="flex flex-wrap gap-3 pt-2">
    <span className="chip">
      <span
        className="dot"
        style={{ backgroundColor: BOOKING_CONFIG.COLORS.DIRECT.BACKGROUND }}
      ></span>
      <span className="text-slate-300">{BOOKING_CONFIG.STATUS_LABELS.DIRECT}</span>
    </span>
    <span className="chip">
      <span
        className="dot"
        style={{ backgroundColor: BOOKING_CONFIG.COLORS.AIRBNB.BACKGROUND }}
      ></span>
      <span className="text-slate-300">{BOOKING_CONFIG.STATUS_LABELS.AIRBNB}</span>
    </span>
  </div>
);

export default CalendarLegend;
