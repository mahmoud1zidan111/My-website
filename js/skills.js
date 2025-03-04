document.addEventListener("DOMContentLoaded", function () {
    const skills = document.querySelectorAll(".skill");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let skill = entry.target;
                let progressBar = skill.querySelector(".progress");
                let percentage = skill.querySelector(".percentage");
                let value = progressBar.getAttribute("data-value");

                // إعادة ضبط شريط التقدم
                progressBar.style.width = "0%";
                percentage.textContent = "0%";

                let width = 0;
                let interval = setInterval(() => {
                    if (width >= value) {
                        clearInterval(interval);
                    } else {
                        width++;
                        progressBar.style.width = width + "%";
                        percentage.textContent = width + "%";
                    }
                }, 25);
            }
        });
    }); // يتم التفعيل عندما يكون نصف العنصر ظاهرًا

    skills.forEach(skill => {
        observer.observe(skill);
    });
});
 