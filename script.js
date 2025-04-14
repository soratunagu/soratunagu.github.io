document.addEventListener("DOMContentLoaded", () => {
    // Firebase configuration and initialization
    const firebaseConfig = {
      apiKey: "ADD_API_HERE",
      authDomain: "ADD_AUTH_DOMAIN_HERE",
      databaseURL: "ADD_DATABASE_URL_HERE",
      projectId: "ADD_PROJECT_ID_HERE",
      storageBucket: "ADD_STORAGE_BUCKET_HERE",
      messagingSenderId: "ADD_MESSAGING_SENDER_ID_HERE",
      appId: "ADD_APP_ID_HERE",
    }

  
    // Initialize Firebase
    let firebase // Declare firebase variable
    try {
      firebase = window.firebase // Assign firebase from window object
      firebase.initializeApp(firebaseConfig)
    } catch (error) {
      console.error("Firebase initialization error:", error)
    }
    const database = firebase ? firebase.database() : null
  
    // Elements
    const heroSection = document.querySelector(".hero-section")
    const carouselSlides = document.querySelectorAll(".carousel-slide")
    const indicators = document.querySelectorAll(".indicator")
    const bookNowBtns = document.querySelectorAll(
      ".book-now-btn, #navBookNow, #heroBookNow, #aboutBookNow, #fixedBookNow, #groupBooking",
    )
    const bookingModal = document.getElementById("bookingModal")
    const successModal = document.getElementById("successModal")
    const summaryModal = document.getElementById("summaryModal")
    const closeModalBtns = document.querySelectorAll(".close-modal, #closeSuccessBtn, #closeSummaryModal")
    const selectedExperience = document.getElementById("selectedExperience")
    const reservationDateInput = document.getElementById("reservationDate")
    const calendarContainer = document.getElementById("calendar")
    const calendarTable = document.getElementById("calendarTable")
    const prevMonthBtn = document.getElementById("prevMonth")
    const nextMonthBtn = document.getElementById("nextMonth")
    const calendarMonthDisplay = document.getElementById("calendarMonth")
    const submitBtn = document.getElementById("submitBtn")
    const warningMessage = document.querySelector(".warning")
    const filterBtns = document.querySelectorAll(".filter-btn")
    const experienceCards = document.querySelectorAll(".experience-card")
    const body = document.body
  
    // Variables
    let currentSlide = 0
    let carouselInterval
    let availableDates = []
    let currentMonth = new Date().getMonth()
    let currentYear = new Date().getFullYear()
    let isCalendarOpen = false // Track calendar state
  
    // セクションが画面に表示されたらフェードインする
    const sections = document.querySelectorAll("section")
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2, // 20%が画面に表示された時に発動
    }
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    }, options)
  
    sections.forEach((section) => {
      observer.observe(section)
    })
  
    // スムーズスクロール
    const links = document.querySelectorAll("nav ul li a, .fixed-reservation-button a")
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      })
    })
  
    // Hero Carousel
    function showSlide(index) {
      carouselSlides.forEach((slide) => {
        slide.classList.remove("active")
      })
  
      indicators.forEach((indicator) => {
        indicator.classList.remove("active")
      })
  
      setTimeout(() => {
        carouselSlides[index].classList.add("active")
        indicators[index].classList.add("active")
      }, 50)
    }
  
    function nextSlide() {
      currentSlide = (currentSlide + 1) % carouselSlides.length
      showSlide(currentSlide)
    }
  
    // Set up indicator clicks
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", (e) => {
        // Prevent event from bubbling up to document
        e.stopPropagation()
        currentSlide = index
        showSlide(currentSlide)
      })
    })
  
    // Start the carousel
    if (carouselSlides.length > 0) {
      carouselInterval = setInterval(nextSlide, 7000) // Increased to 7 seconds for better pacing
  
      // Pause carousel on hover
      if (heroSection) {
        heroSection.addEventListener("mouseenter", () => {
          clearInterval(carouselInterval)
        })
  
        heroSection.addEventListener("mouseleave", () => {
          clearInterval(carouselInterval)
          carouselInterval = setInterval(nextSlide, 7000)
        })
      }
  
      // Initialize the first slide
      showSlide(currentSlide)
    }
  
    // Sticky Header
    const header = document.querySelector(".sticky-header")
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  
    // Mobile Menu
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", (e) => {
        // Prevent event from bubbling up to document
        e.stopPropagation()
  
        // Create mobile nav if it doesn't exist
        if (!document.querySelector(".mobile-nav")) {
          const mobileNav = document.createElement("div")
          mobileNav.className = "mobile-nav"
  
          const closeBtn = document.createElement("div")
          closeBtn.className = "close-mobile-nav"
          closeBtn.innerHTML = "&times;"
          closeBtn.setAttribute("aria-label", "Close menu")
  
          // Clone the nav items but preserve the classes
          const navItems = document.querySelector("nav ul").cloneNode(true)
  
          // Make sure the Book Now button in mobile menu works properly
          const bookNowLink = navItems.querySelector(".nav-cta")
          if (bookNowLink) {
            bookNowLink.addEventListener("click", (e) => {
              e.preventDefault()
              e.stopPropagation()
              mobileNav.classList.remove("active")
              body.style.overflow = ""
  
              // Show booking modal
              if (bookingModal) {
                bookingModal.classList.add("active")
                body.style.overflow = "hidden"
              }
            })
          }
  
          mobileNav.appendChild(closeBtn)
          mobileNav.appendChild(navItems)
          body.appendChild(mobileNav)
  
          // Close mobile nav
          closeBtn.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            mobileNav.classList.remove("active")
            body.style.overflow = ""
          })
  
          // Handle nav item clicks
          const mobileNavItems = mobileNav.querySelectorAll("a:not(.nav-cta)")
          mobileNavItems.forEach((item) => {
            item.addEventListener("click", (e) => {
              e.stopPropagation()
              mobileNav.classList.remove("active")
              body.style.overflow = ""
            })
          })
        }
  
        // Toggle mobile nav
        const mobileNav = document.querySelector(".mobile-nav")
        mobileNav.classList.add("active")
        body.style.overflow = "hidden"
      })
    }
  
    // Experience Filters
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        // Prevent event from bubbling up to document
        e.stopPropagation()
  
        // Remove active class from all buttons
        filterBtns.forEach((b) => b.classList.remove("active"))
        // Add active class to clicked button
        this.classList.add("active")
  
        const filter = this.getAttribute("data-filter")
  
        experienceCards.forEach((card) => {
          if (filter === "all" || card.getAttribute("data-category") === filter) {
            card.style.display = "block"
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "translateY(0)"
            }, 10)
          } else {
            card.style.opacity = "0"
            card.style.transform = "translateY(20px)"
            setTimeout(() => {
              card.style.display = "none"
            }, 300)
          }
        })
      })
    })
  
    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
      question.addEventListener("click", (e) => {
        // Prevent event from bubbling up to document
        e.stopPropagation()
  
        // Close all other items
        faqItems.forEach((i) => {
          if (i !== item) {
            i.classList.remove("active")
          }
        })
  
        // Toggle current item
        item.classList.toggle("active")
      })
    })
  
    // Testimonial Slider
    const testimonialSlider = document.getElementById("testimonialSlider")
    const testimonialSlides = testimonialSlider ? testimonialSlider.querySelectorAll(".testimonial-slide") : []
    const prevBtn = document.getElementById("prevTestimonial")
    const nextBtn = document.getElementById("nextTestimonial")
    let currentTestimonial = 0
  
    if (testimonialSlides.length > 0) {
      // Hide all slides except the first one
      testimonialSlides.forEach((slide, index) => {
        if (index !== 0) {
          slide.style.display = "none"
        }
      })
  
      // Show a specific slide
      function showTestimonialSlide(index) {
        // Hide all slides
        testimonialSlides.forEach((slide) => {
          slide.style.display = "none"
        })
  
        // Show the selected slide
        testimonialSlides[index].style.display = "block"
        testimonialSlides[index].classList.add("fade-in")
      }
  
      // Previous slide
      if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
          // Prevent event from bubbling up to document
          e.stopPropagation()
  
          currentTestimonial--
          if (currentTestimonial < 0) {
            currentTestimonial = testimonialSlides.length - 1
          }
          showTestimonialSlide(currentTestimonial)
        })
      }
  
      // Next slide
      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          // Prevent event from bubbling up to document
          e.stopPropagation()
  
          currentTestimonial++
          if (currentTestimonial >= testimonialSlides.length) {
            currentTestimonial = 0
          }
          showTestimonialSlide(currentTestimonial)
        })
  
        // Auto slide every 8 seconds
        setInterval(() => {
          if (!isCalendarOpen) {
            // Don't auto-advance if calendar is open
            nextBtn.click()
          }
        }, 8000)
      }
    }
  
    // Gallery Lightbox
    initLightbox()
  
    // Contact Form Validation
    initContactForm()
  
    // Booking Modal
    bookNowBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation() // Prevent event from bubbling up to document
  
        // Set the selected experience if available
        if (this.hasAttribute("data-experience") && selectedExperience) {
          const experience = this.getAttribute("data-experience")
          selectedExperience.innerHTML = `<p class="selected-experience">Selected Experience: <strong>${experience}</strong></p>`
  
          // Also set the dropdown value
          const classSelect = document.getElementById("classSelect")
          if (classSelect) {
            for (let i = 0; i < classSelect.options.length; i++) {
              if (classSelect.options[i].value === experience) {
                classSelect.selectedIndex = i
                break
              }
            }
          }
        } else if (selectedExperience) {
          selectedExperience.innerHTML = ""
        }
  
        // Show the modal
        if (bookingModal) {
          bookingModal.classList.add("active")
          body.style.overflow = "hidden"
        }
      })
    })
  
    // Close modals
    closeModalBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation() // Prevent event from bubbling up to document
  
        if (bookingModal) bookingModal.classList.remove("active")
        if (successModal) successModal.classList.remove("active")
        if (summaryModal) summaryModal.classList.remove("active")
        body.style.overflow = ""
  
        // Also close the calendar if it's open
        if (calendarContainer && calendarContainer.style.display === "block") {
          closeCalendar()
        }
      })
    })
  
    // Close modal when clicking outside - MODIFIED to exclude booking modal
    // Only success and summary modals will close when clicking outside
    const modalElements = [successModal, summaryModal].filter(Boolean)
    modalElements.forEach((modal) => {
      if (modal) {
        modal.addEventListener("click", (e) => {
          // Only close if clicking directly on the modal background, not its content
          if (e.target === modal) {
            modal.classList.remove("active")
            body.style.overflow = ""
          }
        })
      }
    })
  
    // Load available dates
    function loadAvailableDates() {
      fetch("reservation-date/available-dates.json")
        .then((response) => response.json())
        .then((data) => {
          availableDates = data.availableDates
          // Render calendar after dates are loaded
          if (calendarContainer && calendarContainer.style.display === "block") {
            renderCalendar()
          }
        })
        .catch((error) => {
          console.error("Error loading available dates:", error)
          // Fallback to some default available dates if needed
          const today = new Date()
          availableDates = [
            `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-15`,
            `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-16`,
            `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-17`,
            `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-20`,
            `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-21`,
          ]
  
          // Render calendar with fallback dates
          if (calendarContainer && calendarContainer.style.display === "block") {
            renderCalendar()
          }
        })
    }
  
    // Render calendar
    function renderCalendar() {
      const firstDay = new Date(currentYear, currentMonth, 1).getDay()
      const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate()
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
  
      calendarMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`
  
      // Create header row with day names
      let tableHTML = "<thead><tr>"
      ;["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
        tableHTML += `<th>${day}</th>`
      })
      tableHTML += "</tr></thead><tbody>"
  
      // Create calendar days
      let dayCount = 1
      for (let i = 0; i < 6; i++) {
        tableHTML += "<tr>"
        for (let j = 0; j < 7; j++) {
          if ((i === 0 && j < firstDay) || dayCount > lastDate) {
            tableHTML += "<td></td>"
          } else {
            const dateFormatted = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${dayCount.toString().padStart(2, "0")}`
            const isAvailable = availableDates.includes(dateFormatted)
            const isToday =
              dayCount === new Date().getDate() &&
              currentMonth === new Date().getMonth() &&
              currentYear === new Date().getFullYear()
  
            tableHTML += `<td class="${isAvailable ? "available" : ""} ${isToday ? "today" : ""}" 
                             data-date="${dayCount}">${dayCount}</td>`
            dayCount++
          }
        }
        tableHTML += "</tr>"
  
        // Break if we've displayed all days
        if (dayCount > lastDate) break
      }
  
      tableHTML += "</tbody>"
      calendarTable.innerHTML = tableHTML
  
      // Add click handlers to calendar cells after rendering
      addCalendarCellHandlers()
    }
  
    // Add click handlers to calendar cells
    function addCalendarCellHandlers() {
      const cells = calendarTable.querySelectorAll("td[data-date]")
      cells.forEach((cell) => {
        cell.addEventListener("click", handleCalendarCellClick)
      })
    }
  
    // Handle calendar cell click
    function handleCalendarCellClick(e) {
      e.preventDefault()
      e.stopPropagation() // Prevent event from bubbling up
  
      const selectedDay = this.dataset.date
      const selectedDate = `${(currentMonth + 1).toString().padStart(2, "0")}/${selectedDay}/${currentYear}`
  
      // Check if the date is available
      const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`
  
      if (availableDates.includes(formattedDate)) {
        reservationDateInput.value = selectedDate
        closeCalendar()
  
        // Clear any previous warnings
        if (warningMessage) {
          warningMessage.style.display = "none"
        }
      } else {
        // Show warning for unavailable date
        if (warningMessage) {
          warningMessage.style.display = "block"
        }
      }
    }
  
    // Calendar date input click
    if (reservationDateInput) {
      reservationDateInput.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation() // Prevent event from bubbling up
  
        // Toggle calendar visibility
        if (calendarContainer.style.display === "block") {
          closeCalendar()
        } else {
          openCalendar()
        }
      })
    }
  
    // Open calendar
    function openCalendar() {
      // Position the calendar below the input
      calendarContainer.style.display = "block"
      isCalendarOpen = true
  
      // Load dates and render calendar
      loadAvailableDates()
      renderCalendar()
  
      // Add a class to the body to indicate calendar is open
      document.body.classList.add("calendar-open")
    }
  
    // Close calendar
    function closeCalendar() {
      calendarContainer.style.display = "none"
      isCalendarOpen = false
      document.body.classList.remove("calendar-open")
    }
  
    // Month navigation - completely rewritten to prevent event propagation issues
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", handlePrevMonth)
    }
  
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", handleNextMonth)
    }
  
    function handlePrevMonth(e) {
      e.preventDefault()
      e.stopPropagation() // Prevent event from bubbling up
  
      currentMonth = (currentMonth - 1 + 12) % 12
      if (currentMonth === 11) currentYear--
      renderCalendar()
    }
  
    function handleNextMonth(e) {
      e.preventDefault()
      e.stopPropagation() // Prevent event from bubbling up
  
      currentMonth = (currentMonth + 1) % 12
      if (currentMonth === 0) currentYear++
      renderCalendar()
    }
  
    // Prevent calendar from closing when clicking inside it
    if (calendarContainer) {
      calendarContainer.addEventListener("click", (e) => {
        e.stopPropagation() // Prevent event from bubbling up to document
      })
    }
  
    // Close calendar when clicking outside - but be very specific about what "outside" means
    // This is a more targeted approach than the previous document-wide listener
    document.addEventListener("click", (e) => {
      // Only process if calendar is open
      if (calendarContainer && calendarContainer.style.display === "block") {
        // Check if the click is outside the calendar and the date input
        const isOutsideCalendar = !calendarContainer.contains(e.target)
        const isNotDateInput = e.target !== reservationDateInput
        const isNotCalendarButton = !e.target.closest(".calendar-nav-btn")
  
        // Only close if clicking outside all calendar-related elements
        if (isOutsideCalendar && isNotDateInput && isNotCalendarButton) {
          closeCalendar()
        }
      }
    })
  
    // Form submission
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation() // Prevent event from bubbling up
        showReservationSummary()
      })
    }
  
    // Show reservation summary
    function showReservationSummary() {
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const reservationDate = document.getElementById("reservationDate").value
      const classSelected = document.getElementById("classSelect").value
      const peopleNumber = document.getElementById("peopleNumber").value
      const additionalQuestion = document.getElementById("additionalQuestion")?.value || ""
  
      // Validate required fields
      if (!name || !email || !phone || !reservationDate || !classSelected || !peopleNumber) {
        alert("Please fill in all required fields.")
        return
      }
  
      // Validate date
      if (!reservationDate) {
        if (warningMessage) warningMessage.style.display = "block"
        return
      }
  
      const dateParts = reservationDate.split("/")
      const formattedDate = `${currentYear}-${dateParts[0].padStart(2, "0")}-${dateParts[1].padStart(2, "0")}`
  
      if (!availableDates.includes(formattedDate)) {
        if (warningMessage) warningMessage.style.display = "block"
        return
      }
  
      // Show summary modal
      if (warningMessage) warningMessage.style.display = "none"
  
      const summaryDetails = document.getElementById("summaryDetails")
      if (summaryDetails) {
        summaryDetails.innerHTML = `
          <strong>Name:</strong> ${name} <br>
          <strong>Email:</strong> ${email} <br>
          <strong>Phone:</strong> ${phone} <br>
          <strong>Reservation Date:</strong> ${reservationDate} <br>
          <strong>Experience:</strong> ${classSelected} <br>
          <strong>Number of People:</strong> ${peopleNumber} <br>
          ${additionalQuestion ? `<strong>Additional Information:</strong> ${additionalQuestion} <br>` : ""}
        `
      }
  
      // Show the summary modal
      if (summaryModal) {
        summaryModal.classList.add("active")
      }
    }
  
    // Reset form
    function resetReservationForm() {
      const formElements = [
        "name",
        "email",
        "phone",
        "reservationDate",
        "classSelect",
        "peopleNumber",
        "additionalQuestion",
      ]
  
      formElements.forEach((id) => {
        const element = document.getElementById(id)
        if (element) element.value = ""
      })
  
      if (summaryModal) summaryModal.classList.remove("active")
      if (warningMessage) warningMessage.style.display = "none"
    }
  
    // Save reservation to Firebase
    window.saveReservation = () => {
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const reservationDate = document.getElementById("reservationDate").value
      const classSelected = document.getElementById("classSelect").value
      const peopleNumber = document.getElementById("peopleNumber").value
      const additionalQuestion = document.getElementById("additionalQuestion")?.value || ""
  
      // Format the date
      const dateParts = reservationDate.split("/")
      const formattedDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`)
      const formattedDateString = formattedDate.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })
  
      // Current timestamp
      const reservationTime = new Date().toLocaleString()
  
      // Create a unique key for the reservation
      const reservationKey = `${name}_${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`
  
      const reservationData = {
        classSelected,
        email,
        name,
        phone,
        reservationDate: formattedDateString,
        reservationTime,
        additionalQuestion,
        peopleNumber,
      }
  
      // Save to Firebase
      if (database) {
        const reservationRef = database.ref("reservations/" + reservationKey)
  
        reservationRef
          .set(reservationData)
          .then(() => {
            // Hide booking modal and summary modal, then show success modal
            if (bookingModal) bookingModal.classList.remove("active")
            if (summaryModal) summaryModal.classList.remove("active")
            if (successModal) successModal.classList.add("active")
  
            // Reset the form
            resetReservationForm()
          })
          .catch((error) => {
            alert("Error saving reservation: " + error.message)
          })
      } else {
        // If Firebase isn't available, simulate success
        if (bookingModal) bookingModal.classList.remove("active")
        if (summaryModal) summaryModal.classList.remove("active")
        if (successModal) successModal.classList.add("active")
  
        // Reset the form
        resetReservationForm()
      }
    }
  
    // Make resetReservationForm globally available
    window.resetReservationForm = resetReservationForm
  
    // Initialize gallery lightbox
    function initLightbox() {
      const galleryItems = document.querySelectorAll(".gallery-item")
      const lightbox = document.getElementById("lightbox")
      const lightboxImg = document.getElementById("lightbox-img")
      const lightboxCaption = document.querySelector(".lightbox-caption")
      const lightboxClose = document.querySelector(".lightbox-close")
      const lightboxPrev = document.querySelector(".lightbox-prev")
      const lightboxNext = document.querySelector(".lightbox-next")
  
      if (!galleryItems.length || !lightbox) return
  
      let currentIndex = 0
  
      galleryItems.forEach((item, index) => {
        item.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation() // Prevent event from bubbling up
  
          currentIndex = index
          const img = item.querySelector("img")
          lightboxImg.src = img.src
          lightboxCaption.textContent = img.alt
          lightbox.classList.add("active")
          document.body.style.overflow = "hidden"
        })
      })
  
      // Close lightbox
      if (lightboxClose) {
        lightboxClose.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation() // Prevent event from bubbling up
  
          lightbox.classList.remove("active")
          document.body.style.overflow = ""
        })
      }
  
      // Close lightbox when clicking outside the image
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove("active")
          document.body.style.overflow = ""
        }
      })
  
      // Previous image
      if (lightboxPrev) {
        lightboxPrev.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation() // Prevent event from bubbling up
  
          currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length
          const img = galleryItems[currentIndex].querySelector("img")
          lightboxImg.src = img.src
          lightboxCaption.textContent = img.alt
        })
      }
  
      // Next image
      if (lightboxNext) {
        lightboxNext.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation() // Prevent event from bubbling up
  
          currentIndex = (currentIndex + 1) % galleryItems.length
          const img = galleryItems[currentIndex].querySelector("img")
          lightboxImg.src = img.src
          lightboxCaption.textContent = img.alt
        })
      }
  
      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return
  
        if (e.key === "Escape") {
          lightbox.classList.remove("active")
          document.body.style.overflow = ""
        } else if (e.key === "ArrowLeft" && lightboxPrev) {
          lightboxPrev.click()
        } else if (e.key === "ArrowRight" && lightboxNext) {
          lightboxNext.click()
        }
      })
    }
  
    // Initialize contact form
    function initContactForm() {
      const contactForm = document.getElementById("contactForm")
      const formSuccess = document.getElementById("formSuccess")
      const formError = document.getElementById("formError")
  
      if (!contactForm) return
  
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
        e.stopPropagation() // Prevent event from bubbling up
  
        // Reset error messages
        document.querySelectorAll(".error-message").forEach((msg) => {
          msg.style.display = "none"
        })
  
        // Get form values
        const name = document.getElementById("contactName").value.trim()
        const email = document.getElementById("contactEmail").value.trim()
        const subject = document.getElementById("contactSubject").value.trim()
        const message = document.getElementById("contactMessage").value.trim()
  
        // Validate form
        let isValid = true
  
        if (name === "") {
          showError("nameError", "Please enter your name")
          isValid = false
        }
  
        if (email === "") {
          showError("emailError", "Please enter your email")
          isValid = false
        } else if (!isValidEmail(email)) {
          showError("emailError", "Please enter a valid email address")
          isValid = false
        }
  
        if (subject === "") {
          showError("subjectError", "Please enter a subject")
          isValid = false
        }
  
        if (message === "") {
          showError("messageError", "Please enter your message")
          isValid = false
        }
  
        if (isValid) {
          // In a real application, you would send the form data to a server here
          // For this example, we'll simulate a successful submission
  
          // Hide the form and show success message
          contactForm.style.display = "none"
          if (formSuccess) formSuccess.style.display = "block"
  
          // Reset the form
          contactForm.reset()
  
          // After 5 seconds, hide the success message and show the form again
          setTimeout(() => {
            if (formSuccess) formSuccess.style.display = "none"
            contactForm.style.display = "block"
          }, 5000)
        }
      })
  
      function showError(id, message) {
        const errorElement = document.getElementById(id)
        if (errorElement) {
          errorElement.textContent = message
          errorElement.style.display = "block"
        }
      }
  
      function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      }
    }
  
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll(
      ".experience-card, .gallery-item, .testimonial-content, .faq-item, .recommendation-card",
    )
  
    const animateElementsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in")
            animateElementsObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
  
    animateElements.forEach((element) => {
      animateElementsObserver.observe(element)
    })
  
    // Load available dates on page load
    loadAvailableDates()
  })
  
