"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createChart, type IChartApi, type CandlestickData } from "lightweight-charts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Res = "1m" | "5m" | "15m" | "1h" | "4h";
type Range = "1H" | "6H" | "24H";

const RES_OPTIONS: Res[] = ["1m", "5m", "15m", "1h", "4h"];
const RANGE_OPTIONS: Range[] = ["1H", "6H", "24H"];

export function TokenChart({ mint }: { mint: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  const [res, setRes] = useState<Res>("15m");
  const [range, setRange] = useState<Range>("24H");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hostRef.current) return;
    const host = hostRef.current;

    const chart = createChart(host, {
      width: host.clientWidth,
      height: 360,
      layout: { background: { color: "transparent" }, textColor: "rgba(255,255,255,0.85)" },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.06)" },
        horzLines: { color: "rgba(255,255,255,0.06)" },
      },
      timeScale: { borderColor: "rgba(255,255,255,0.12)" },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.12)" },
      crosshair: { mode: 1 },
    });

    const series = chart.addCandlestickSeries();
    chartRef.current = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver(() => chart.applyOptions({ width: host.clientWidth }));
    ro.observe(host);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;

    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const { data } = await axios.get(`/api/chart/${mint}`, { params: { res, range } });
        const candles = (data.candles || []).map((c: any) => ({
          time: c.time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })) as CandlestickData[];

        seriesRef.current.setData(candles);
      } catch (e: any) {
        setErr(e?.response?.data?.error || "Chart unavailable");
        seriesRef.current.setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [mint, res, range]);

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-medium">Chart</div>
          <div className="text-xs text-muted-foreground">Candles from on-chain DEX pools</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            {RES_OPTIONS.map((x) => (
              <Button key={x} size="sm" variant={x === res ? "default" : "outline"} onClick={() => setRes(x)}>
                {x}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            {RANGE_OPTIONS.map((x) => (
              <Button key={x} size="sm" variant={x === range ? "default" : "outline"} onClick={() => setRange(x)}>
                {x}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div ref={hostRef} className="w-full rounded-xl border border-border bg-background/30" />
        {loading && <div className="mt-2 text-xs text-muted-foreground">Loading…</div>}
        {err && <div className="mt-2 text-xs text-red-500">{err}</div>}
      </div>
    </Card>
  );
}
