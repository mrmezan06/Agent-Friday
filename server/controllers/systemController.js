const os = require('os');

let prevCpuTimes = null;

function getCpuUsage() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  for (const cpu of cpus) {
    const { user, nice, sys, idle, irq } = cpu.times;
    totalIdle += idle;
    totalTick += user + nice + sys + idle + irq;
  }

  const currentSnapshot = cpus.map((c) => ({
    total: c.times.user + c.times.nice + c.times.sys + c.times.idle + c.times.irq,
    idle: c.times.idle,
  }));

  let usage = 0;
  if (prevCpuTimes) {
    let prevTotalIdle = 0;
    let prevTotalTick = 0;
    for (const p of prevCpuTimes) {
      prevTotalIdle += p.idle;
      prevTotalTick += p.total;
    }
    const deltaTotal = totalTick - prevTotalTick;
    const deltaIdle = totalIdle - prevTotalIdle;
    usage = deltaTotal > 0 ? Math.round(((deltaTotal - deltaIdle) / deltaTotal) * 100) : 0;
  }

  prevCpuTimes = currentSnapshot;
  return usage;
}

exports.getSystemInfo = async () => {
  try {
    const totalMemMB = Math.round(os.totalmem() / 1024 / 1024);
    const freeMemMB = Math.round(os.freemem() / 1024 / 1024);
    const usedMemMB = totalMemMB - freeMemMB;

    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model || 'Unknown';
    const cpuCores = cpus.length;
    const cpuUsage = getCpuUsage();

    return {
      platform: os.platform(),
      hostname: os.hostname(),
      uptime: Math.round(os.uptime()),
      cpu: {
        model: cpuModel.split('@')[0].trim(),
        cores: cpuCores,
        usage: cpuUsage,
      },
      memory: {
        total: totalMemMB,
        used: usedMemMB,
        free: freeMemMB,
        usagePercent: Math.round((usedMemMB / totalMemMB) * 100),
      },
    };
  } catch (error) {
    console.error('System info error:', error.message);
    return null;
  }
};