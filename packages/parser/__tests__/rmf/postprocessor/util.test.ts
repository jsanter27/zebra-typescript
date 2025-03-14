import RmfRequestError from "../../../src/errors/RmfRequestError";
import {
  ddsFormatDate,
  ddsFormatDuration,
  ddsFormatJobOutDel,
  ddsFormatOverview,
  ddsFormatSmfData,
  ddsFormatSmfSort,
  ddsFormatTimeOfDay,
  ddsFormatTimeout,
} from "../../../src/rmf/postprocessor/util";

describe("Postprocessor utility functions", () => {
  it("formatting 'date' parameter in DDS format", () => {
    let startDate: Date;
    let endDate: Date;
    const singleDate = new Date("December 17, 2021 00:00:00");
    expect(ddsFormatDate(singleDate)).toBe("20211217,20211217");
    startDate = new Date("February 04, 2022 00:00:00");
    endDate = new Date("February 05, 2022 00:00:00");
    expect(
      ddsFormatDate({
        start: startDate,
        end: endDate,
      })
    ).toBe("20220204,20220205");
    startDate = new Date("February 05, 2022 00:00:00");
    endDate = new Date("February 04, 2022 00:00:00");
    expect(() =>
      ddsFormatDate({
        start: startDate,
        end: endDate,
      })
    ).toThrow(RmfRequestError);
  });
  it("formatting 'duration' parameter to DDS format", () => {
    let duration: number;
    duration = -1;
    expect(() => ddsFormatDuration(duration)).toThrowError(RmfRequestError);
    duration = 6001;
    expect(() => ddsFormatDuration(duration)).toThrowError(RmfRequestError);
    duration = 0;
    expect(ddsFormatDuration(duration)).toBe("0000");
    duration = 6000;
    expect(ddsFormatDuration(duration)).toBe("9960");
    duration = 754;
    expect(ddsFormatDuration(duration)).toBe("1234");
  });
  it("formatting 'joboutdel' parameter to DDS format", () => {
    let joboutdel: boolean;
    joboutdel = true;
    expect(ddsFormatJobOutDel(joboutdel)).toBe("YES");
    joboutdel = false;
    expect(ddsFormatJobOutDel(joboutdel)).toBe("NO");
  });
  it("formatting `overview` parameter to DDS format", () => {
    let overview: string | string[];
    overview = "DATA01(CADSTG(SSID(0600),DEVN(06F3)";
    expect(ddsFormatOverview(overview)).toBe(
      "(DATA01(CADSTG(SSID(0600),DEVN(06F3))"
    );
    overview = [
      "DATA01(CADSTG(SSID(0600),DEVN(06F3)))",
      "DB2PRD(CADRT(SSID(0700),DEVN(0722)))",
      "RHT0050(CASRHT(SSID(0050)))",
    ];
    expect(ddsFormatOverview(overview)).toBe(
      "(DATA01(CADSTG(SSID(0600),DEVN(06F3)))),(DB2PRD(CADRT(SSID(0700),DEVN(0722)))),(RHT0050(CASRHT(SSID(0050))))"
    );
  });
  it("formatting `smfdata` parameter to DDS format", () => {
    let smfData: string | string[];
    smfData = "FASMF.PERF.SYSDPLEX";
    expect(ddsFormatSmfData(smfData)).toBe("FASMF.PERF.SYSDPLEX");
    smfData = ["RMF.SMFDATA.SYSA", "RMF.SMFDATA.SYSB", "RMF.SMFDATA.SYSC"];
    expect(ddsFormatSmfData(smfData)).toBe(
      "RMF.SMFDATA.SYSA,RMF.SMFDATA.SYSB,RMF.SMFDATA.SYSC"
    );
  });
  it("formatting 'smfsort' parameter to DDS format", () => {
    let smfSort: boolean;
    smfSort = true;
    expect(ddsFormatSmfSort(smfSort)).toBe("YES");
    smfSort = false;
    expect(ddsFormatSmfSort(smfSort)).toBe("NO");
  });
  it("formatting 'timeofday' parameter to DDS format", () => {
    let timeOfDay: { start: number; end: number };
    timeOfDay = {
      start: -1,
      end: 234,
    };
    expect(() => ddsFormatTimeOfDay(timeOfDay)).toThrowError(RmfRequestError);
    timeOfDay = {
      start: 236,
      end: 1440,
    };
    expect(() => ddsFormatTimeOfDay(timeOfDay)).toThrowError(RmfRequestError);
    timeOfDay = {
      start: 59,
      end: 0,
    };
    expect(() => ddsFormatTimeOfDay(timeOfDay)).toThrowError(RmfRequestError);
    timeOfDay = {
      start: 0,
      end: 29,
    };
    expect(ddsFormatTimeOfDay(timeOfDay)).toBe("0000,0029");
    timeOfDay = {
      start: 1410,
      end: 1439,
    };
    expect(ddsFormatTimeOfDay(timeOfDay)).toBe("2330,2359");
  });
  it("formatting 'timeout' parameter to DDS format", () => {
    let timeout: number;
    timeout = -1;
    expect(() => ddsFormatTimeout(timeout)).toThrowError(RmfRequestError);
    timeout = 3601;
    expect(() => ddsFormatTimeout(timeout)).toThrowError(RmfRequestError);
    timeout = 0;
    expect(ddsFormatTimeout(timeout)).toBe("0");
    timeout = 3600;
    expect(ddsFormatTimeout(timeout)).toBe("3600");
    timeout = 487;
    expect(ddsFormatTimeout(timeout)).toBe("487");
  });
});
