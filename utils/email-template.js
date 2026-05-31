const WORKFLOW_DAYS = [7, 5, 3, 1];

const SUBJECT_MAP = {
	7: 'Your subscription renews in 7 days',
	5: 'Reminder: subscription renewal in 5 days',
	3: 'Action needed: renewal in 3 days',
	1: 'Final reminder: renewal tomorrow',
};

const TITLE_MAP = {
	7: 'Subscription Renewal Reminder',
	5: 'Your Renewal Is Coming Up',
	3: 'Please Review Your Subscription',
	1: 'Final Reminder Before Renewal',
};

const MESSAGE_MAP = {
	7: 'Your subscription will renew in 7 days. You can review your plan details and billing preferences now.',
	5: 'This is a friendly reminder that your subscription renews in 5 days.',
	3: 'Your subscription renewal is in 3 days. Please confirm your billing details to avoid interruption.',
	1: 'Your subscription renews tomorrow. This is your final reminder before billing is processed.',
};

function formatCurrency(value, currency = 'USD', locale = 'en-US') {
	const amount = Number(value ?? 0);
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		maximumFractionDigits: 2,
	}).format(amount);
}

function formatDate(dateInput, locale = 'en-US') {
	if (!dateInput) return 'N/A';
	const date = new Date(dateInput);
	if (Number.isNaN(date.getTime())) return 'N/A';
	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date);
}

function getWorkflowDay(days) {
	const parsed = Number(days);
	return WORKFLOW_DAYS.includes(parsed) ? parsed : 7;
}

function buildEmailTemplate({
	workflowDay,
	customerName = 'Customer',
	planName = 'Subscription Plan',
	renewalDate,
	amount,
	currency = 'USD',
	manageUrl = '#',
	supportEmail = 'support@example.com',
	locale = 'en-US',
} = {}) {
	const day = getWorkflowDay(workflowDay);
	const subject = SUBJECT_MAP[day];
	const title = TITLE_MAP[day];
	const message = MESSAGE_MAP[day];

	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${subject}</title>
	<style>
		body { margin:0; padding:0; background:#f3f5f7; font-family:Arial, Helvetica, sans-serif; color:#111827; }
		.wrap { width:100%; padding:24px 12px; }
		.card { max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb; }
		.header { background:#0f172a; color:#ffffff; padding:24px; }
		.header h1 { margin:0; font-size:22px; line-height:1.3; }
		.body { padding:24px; }
		.body p { margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151; }
		.meta { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin:18px 0; }
		.meta-row { margin:0 0 10px; font-size:14px; color:#1f2937; }
		.meta-row:last-child { margin-bottom:0; }
		.label { color:#6b7280; display:inline-block; min-width:130px; }
		.btn-wrap { margin-top:24px; }
		.btn { display:inline-block; background:#2563eb; color:#ffffff !important; text-decoration:none; font-weight:bold; padding:12px 18px; border-radius:8px; }
		.footer { border-top:1px solid #e5e7eb; margin-top:24px; padding-top:16px; font-size:12px; color:#6b7280; }
	</style>
</head>
<body>
	<div class="wrap">
		<div class="card">
			<div class="header">
				<h1>${title}</h1>
			</div>
			<div class="body">
				<p>Hi ${customerName},</p>
				<p>${message}</p>

				<div class="meta">
					<p class="meta-row"><span class="label">Plan:</span> ${planName}</p>
					<p class="meta-row"><span class="label">Renewal date:</span> ${formatDate(renewalDate, locale)}</p>
					<p class="meta-row"><span class="label">Amount:</span> ${formatCurrency(amount, currency, locale)}</p>
					<p class="meta-row"><span class="label">Workflow day:</span> D-${day}</p>
				</div>

				<div class="btn-wrap">
					<a class="btn" href="${manageUrl}" target="_blank" rel="noopener noreferrer">Manage Subscription</a>
				</div>

				<div class="footer">
					Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>
				</div>
			</div>
		</div>
	</div>
</body>
</html>`;

	return {
		workflowDay: day,
		subject,
		html,
	};
}

export {
    WORKFLOW_DAYS,
    buildEmailTemplate,
};

